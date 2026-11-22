"""Background music bed for a map explainer project.

Usage: python3 music_bed.py --project <dir> [--regen]
Reads <dir>/timing.json for the video length. Writes <dir>/audio/music.wav.

NixOS: CUDA may need LD_LIBRARY_PATH=/run/opengl-driver/lib to load the GPU libraries.
Without a usable GPU the script falls back to CPU.

Stage 1: generate three MusicGen candidates (cached as audio/music_raw_<seed>.wav).
Stage 2: pick the most stable candidate by 1 s RMS coefficient of variation.
Stage 3: loop the chosen clip with equal-power crossfades to the video length
         and write audio/music.wav (48 kHz, stereo, PCM16, peak -3 dBFS).

Run with --regen to force regeneration of the raw candidates.
Run without arguments to reuse cached raw candidates (stage 1 skipped).
"""

import argparse
import json
import os
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
from scipy.signal import resample_poly
from transformers import AutoProcessor, MusicgenForConditionalGeneration

# Set from --project in main().
AUDIO_DIR = Path("audio")
TIMING_PATH = Path("timing.json")

PROMPT = (
    "gentle curious acoustic underscore, soft plucked guitar and warm felt piano, "
    "light marimba, calm and thoughtful, steady 88 bpm, consistent texture, "
    "instrumental only, no vocals, no drums, no drops, no build-ups, "
    "designed to sit under voiceover"
)
SEEDS = [1, 2, 3]
MODEL_PRIMARY = "facebook/musicgen-medium"
MODEL_FALLBACK = "facebook/musicgen-small"
GUIDANCE_SCALE = 3.0
TEMPERATURE = 0.9
MAX_NEW_TOKENS = 1500

RAW_SR = 32000
OUT_SR = 48000
DEFAULT_LENGTH_S = 600.0
TRIM_START_S = 1.0
TRIM_END_S = 1.5
XFADE_S = 3.0
FADE_IN_S = 2.0
FADE_OUT_S = 5.0
TARGET_PEAK_DBFS = -3.0


def raw_path(seed):
    return AUDIO_DIR / f"music_raw_{seed}.wav"


def load_model():
    # Try GPU medium, then GPU small, then CPU small (GPU may be busy with other processes).
    options = []
    if torch.cuda.is_available():
        options += [("cuda", MODEL_PRIMARY), ("cuda", MODEL_FALLBACK)]
    options += [("cpu", MODEL_FALLBACK)]
    for device, name in options:
        try:
            processor = AutoProcessor.from_pretrained(name)
            model = MusicgenForConditionalGeneration.from_pretrained(name).to(device)
            model.eval()
            print(f"model={name} device={device}", flush=True)
            return name, device, processor, model
        except Exception as exc:  # fall through to the next option
            print(f"load failed for {name} on {device}: {exc}", flush=True)
    raise SystemExit("no MusicGen model could be loaded")


def generate_candidates():
    name, device, processor, model = load_model()
    assert model.config.audio_encoder.sampling_rate == RAW_SR
    for seed in SEEDS:
        torch.manual_seed(seed)
        if device == "cuda":
            torch.cuda.manual_seed_all(seed)
        inputs = processor(text=[PROMPT], padding=True, return_tensors="pt").to(device)
        with torch.inference_mode():
            audio = model.generate(
                **inputs,
                do_sample=True,
                guidance_scale=GUIDANCE_SCALE,
                temperature=TEMPERATURE,
                max_new_tokens=MAX_NEW_TOKENS,
            )
        wav = audio[0, 0].float().cpu().numpy()
        sf.write(raw_path(seed), wav, RAW_SR, subtype="PCM_16")
        print(f"seed={seed} samples={len(wav)} seconds={len(wav) / RAW_SR:.2f} written", flush=True)
    return name, device


def rms_per_second(mono_32k):
    n = len(mono_32k) // RAW_SR
    windows = mono_32k[: n * RAW_SR].reshape(n, RAW_SR)
    return np.sqrt(np.mean(windows.astype(np.float64) ** 2, axis=1))


def candidate_stats(seed):
    data, sr = sf.read(raw_path(seed), dtype="float32")
    assert sr == RAW_SR
    if data.ndim > 1:
        data = data.mean(axis=1)
    rms = rms_per_second(data)
    median = float(np.median(rms))
    gap_threshold = max(1e-3, 0.1 * median)
    gaps = int(np.sum(rms < gap_threshold))
    stats = {
        "seed": seed,
        "seconds": round(len(data) / RAW_SR, 2),
        "rms_mean": float(rms.mean()),
        "rms_std": float(rms.std()),
        "cv": float(rms.std() / rms.mean()),
        "rms_min_dbfs": float(20 * np.log10(max(rms.min(), 1e-12))),
        "rms_max_dbfs": float(20 * np.log10(max(rms.max(), 1e-12))),
        "gap_windows": gaps,
        "data": data,
    }
    return stats


def select_candidate(stats_list):
    print("candidate stats (1 s RMS windows):", flush=True)
    for s in stats_list:
        print(
            f"  seed={s['seed']} seconds={s['seconds']} cv={s['cv']:.4f} "
            f"rms_std={s['rms_std']:.5f} rms_mean={s['rms_mean']:.5f} "
            f"min={s['rms_min_dbfs']:.1f} dBFS max={s['rms_max_dbfs']:.1f} dBFS "
            f"gap_windows={s['gap_windows']}",
            flush=True,
        )
    clean = [s for s in stats_list if s["gap_windows"] == 0]
    pool = clean if clean else stats_list
    if not clean:
        print("WARNING: no candidate free of near-silent gaps; choosing lowest CV anyway", flush=True)
    chosen = min(pool, key=lambda s: s["cv"])
    print(f"chosen seed={chosen['seed']} cv={chosen['cv']:.4f}", flush=True)
    return chosen


def target_length_s():
    if TIMING_PATH.exists():
        timing = json.loads(TIMING_PATH.read_text())
        if "total" in timing:
            length = float(timing["total"])
            print(f"length from timing.json total={length}", flush=True)
            return length
        print("timing.json has no 'total' key; using default", flush=True)
    else:
        print("timing.json not found; using default length", flush=True)
    return DEFAULT_LENGTH_S


def build_music(clip_32k, length_s):
    clip = resample_poly(clip_32k, 3, 2).astype(np.float32)  # 32 kHz -> 48 kHz
    trim_start = int(TRIM_START_S * OUT_SR)
    trim_end = int(TRIM_END_S * OUT_SR)
    body = clip[trim_start : len(clip) - trim_end]
    xf = int(XFADE_S * OUT_SR)
    if len(body) <= 2 * xf:
        raise SystemExit("clip too short for the crossfade length")

    t = np.linspace(0.0, 1.0, xf, dtype=np.float32)
    fade_out_curve = np.cos(t * np.pi / 2)  # equal power: out^2 + in^2 = 1
    fade_in_curve = np.sin(t * np.pi / 2)

    total = int(round(length_s * OUT_SR))
    out = body.copy()
    loops = 1
    while len(out) < total:
        out = np.concatenate(
            [
                out[:-xf],
                out[-xf:] * fade_out_curve + body[:xf] * fade_in_curve,
                body[xf:],
            ]
        )
        loops += 1
    out = out[:total].copy()
    print(f"looped clip {loops} times to {len(out) / OUT_SR:.2f} s", flush=True)

    fin = int(FADE_IN_S * OUT_SR)
    fout = int(FADE_OUT_S * OUT_SR)
    out[:fin] *= np.sin(np.linspace(0.0, np.pi / 2, fin, dtype=np.float32))
    out[-fout:] *= np.cos(np.linspace(0.0, np.pi / 2, fout, dtype=np.float32))

    peak = float(np.max(np.abs(out)))
    target = 10 ** (TARGET_PEAK_DBFS / 20)
    out = out * (target / peak)
    print(f"peak after normalise={20 * np.log10(np.max(np.abs(out))):.2f} dBFS", flush=True)

    stereo = np.stack([out, out], axis=1)
    out_path = AUDIO_DIR / "music.wav"
    sf.write(out_path, stereo, OUT_SR, subtype="PCM_16")
    info = sf.info(out_path)
    print(
        f"wrote {out_path} duration={info.duration:.3f}s sr={info.samplerate} "
        f"channels={info.channels} subtype={info.subtype}",
        flush=True,
    )
    return out_path


def main():
    global AUDIO_DIR, TIMING_PATH
    parser = argparse.ArgumentParser(description="Build audio/music.wav for a map explainer project.")
    parser.add_argument("--project", default=os.getcwd(), help="project folder (default: current folder)")
    parser.add_argument("--regen", action="store_true", help="regenerate the raw MusicGen candidates")
    args = parser.parse_args()
    project = Path(args.project).resolve()
    AUDIO_DIR = project / "audio"
    TIMING_PATH = project / "timing.json"
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    regen = args.regen
    if regen or not all(raw_path(s).exists() for s in SEEDS):
        generate_candidates()
    else:
        print("using cached raw candidates", flush=True)

    stats_list = [candidate_stats(s) for s in SEEDS]
    chosen = select_candidate(stats_list)
    length_s = target_length_s()
    build_music(chosen["data"], length_s)


if __name__ == "__main__":
    main()
