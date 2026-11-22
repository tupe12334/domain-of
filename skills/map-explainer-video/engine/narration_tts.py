"""Synthesise narration for a map explainer project.

Reads <project>/narration_script.json and writes, in the project:
  audio/seg_NNN.wav, audio/seg_NNN.txt   one clip per segment, cached
  audio/narration.wav                    full narration track
  timing.json                            segment start, duration and pause
  data.js                                window.SCRIPT and window.TIMING for the page

Usage:
  python3 narration_tts.py --project <dir> [--voice bm_george] [--lang en-gb] [--speed 1.0]
                           [--model <file>.onnx] [--voices <file>.bin]

Model files, in order: --model/--voices, then env KOKORO_MODEL/KOKORO_VOICES,
then ~/dev/tts-kokoro/kokoro-v1.0.onnx and ~/dev/tts-kokoro/voices-v1.0.bin.
Download: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0

Cache: a clip is reused when its .txt sidecar equals the spoken text. The cache does
not check voice or speed. Delete audio/seg_*.wav after you change either.

Speech fixes: SPEECH_FIXES maps written text to the spelling the voice reads.
A project can replace it with <project>/speech_fixes.json, a JSON object.
"""
import argparse
import json
import os
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

SR = 24000
THRESH = 0.005
MARGIN = 0.05
LEAD = 0.8
SPEECH_FIXES = {"CAC": "cack"}
DEFAULT_MODEL_DIR = os.path.expanduser("~/dev/tts-kokoro")
MODEL_RELEASE_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0"


def parse_args():
    p = argparse.ArgumentParser(description="Synthesise narration for a map explainer project.")
    p.add_argument("--project", default=os.getcwd(), help="project folder (default: current folder)")
    p.add_argument("--model", default=None, help="Kokoro .onnx model file")
    p.add_argument("--voices", default=None, help="Kokoro voices .bin file")
    p.add_argument("--voice", default="bm_george")
    p.add_argument("--lang", default="en-gb")
    p.add_argument("--speed", type=float, default=1.0)
    return p.parse_args()


def resolve_model_file(cli_value, env_name, default_name):
    path = cli_value or os.environ.get(env_name) or os.path.join(DEFAULT_MODEL_DIR, default_name)
    path = os.path.expanduser(path)
    if not os.path.exists(path):
        sys.exit(
            f"model file not found: {path}\n"
            f"Download kokoro-v1.0.onnx and voices-v1.0.bin from {MODEL_RELEASE_URL}\n"
            f"then pass --model/--voices or set {env_name}."
        )
    return path


def load_speech_fixes(project):
    path = os.path.join(project, "speech_fixes.json")
    if not os.path.exists(path):
        return dict(SPEECH_FIXES)
    with open(path, encoding="utf-8") as f:
        fixes = json.load(f)
    if not isinstance(fixes, dict):
        sys.exit(f"{path} must hold a JSON object, for example {{\"CAC\": \"cack\"}}")
    return {str(k): str(v) for k, v in fixes.items()}


def apply_speech_fixes(text, fixes):
    for src, dst in fixes.items():
        text = text.replace(src, dst)
    return text


def trim(x):
    idx = np.where(np.abs(x) >= THRESH)[0]
    if idx.size == 0:
        return x
    m = int(MARGIN * SR)
    return x[max(0, idx[0] - m):min(len(x), idx[-1] + 1 + m)]


def main():
    args = parse_args()
    project = os.path.abspath(args.project)
    audio_dir = os.path.join(project, "audio")

    script_path = os.path.join(project, "narration_script.json")
    if not os.path.exists(script_path):
        sys.exit(f"missing {script_path}. Run narration_script.py in the project first.")
    with open(script_path, encoding="utf-8") as f:
        segs = json.load(f)

    model = resolve_model_file(args.model, "KOKORO_MODEL", "kokoro-v1.0.onnx")
    voices = resolve_model_file(args.voices, "KOKORO_VOICES", "voices-v1.0.bin")
    fixes = load_speech_fixes(project)
    os.makedirs(audio_dir, exist_ok=True)

    k = Kokoro(model, voices)
    clips = []
    synth = 0
    for i, s in enumerate(segs):
        spoken = apply_speech_fixes(s["text"], fixes)
        wav = os.path.join(audio_dir, f"seg_{i:03d}.wav")
        side = os.path.join(audio_dir, f"seg_{i:03d}.txt")
        cached = False
        if os.path.exists(wav) and os.path.exists(side):
            with open(side, encoding="utf-8") as f:
                cached = f.read() == spoken
        if cached:
            x, sr = sf.read(wav, dtype="float32")
            if x.ndim > 1:
                x = x[:, 0]
        else:
            x, sr = k.create(spoken, voice=args.voice, speed=args.speed, lang=args.lang)
            x = np.asarray(x, dtype=np.float32)
            if x.ndim > 1:
                x = x[:, 0]
            assert sr == SR, f"unexpected sample rate {sr}"
            x = trim(x)
            sf.write(wav, x, SR, subtype="PCM_16")
            with open(side, "w", encoding="utf-8") as f:
                f.write(spoken)
            synth += 1
        clips.append(x)
        print(f"[{i + 1:03d}/{len(segs)}] {len(x) / SR:5.2f}s"
              f"{' (cached)' if cached else ''}", flush=True)

    print(f"synthesised {synth}, cached {len(segs) - synth}")

    parts = [np.zeros(int(LEAD * SR), dtype=np.float32)]
    cursor = LEAD
    timing = []
    for s, x in zip(segs, clips):
        dur = len(x) / SR
        timing.append({"start": round(cursor, 4), "dur": round(dur, 4),
                       "pause": s["pause"]})
        parts.append(x)
        cursor += dur
        gap = np.zeros(int(round(s["pause"] * SR)), dtype=np.float32)
        parts.append(gap)
        cursor += len(gap) / SR

    narration = np.concatenate(parts)
    pcm = (np.clip(narration, -1.0, 1.0) * 32767).astype(np.int16)
    sf.write(os.path.join(audio_dir, "narration.wav"), pcm, SR, subtype="PCM_16")

    total = len(narration) / SR + 1.0
    timing_obj = {"segments": timing, "total": round(total, 4)}
    timing_json = json.dumps(timing_obj, indent=1)
    with open(os.path.join(project, "timing.json"), "w", encoding="utf-8") as f:
        f.write(timing_json + "\n")

    script_json = json.dumps(segs, indent=1, ensure_ascii=False)
    with open(os.path.join(project, "data.js"), "w", encoding="utf-8") as f:
        f.write("window.SCRIPT = " + script_json + ";\n")
        f.write("window.TIMING = " + timing_json + ";\n")

    mm, ss = divmod(int(round(total)), 60)
    print(f"{len(segs)} segments, total {mm:02d}:{ss:02d} ({total:.2f}s)")


if __name__ == "__main__":
    main()
