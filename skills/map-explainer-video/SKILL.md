---
name: map-explainer-video
description: Make a narrated "Map of X" explainer video that teaches a whole field as one illustrated map, in the style of Domain of Science (Dominic Walliman). Use when the user wants to learn or teach a subject as a map, asks for a video "like Domain of Science", "map of <field>", or a visual overview of how the parts of a field connect.
---

# Map explainer video

Style credit: this format follows the "Map of X" videos by **Domain of Science** (Dominic Walliman, youtube.com/@DomainofScience). This skill is an unofficial fan tool and is not affiliated with him. Every video made with it must credit him on screen and in its description. The engine always draws a credit line, so never remove it.

## Why this format teaches well

A field taught as a list of facts leaves the learner with no structure. A map gives each idea a **place**, and a place gives context: what is next to what, what is built on what, and where the unknowns are. The viewer builds a mental map while the narrator walks across it. At the end, the whole map appears, and the viewer sees the structure they just learned.

Read `references/domain-of-science-style.md` before you write anything. It records what the style is, from a study of four of his videos. Read `references/script-pattern.md` before you write the narration.

## What to make

One video of 8–12 minutes, made of:

1. **A narration script.** Segments of one or two sentences in a calm, curious first-person voice. Each segment names the map items it reveals and the word that cues each one.
2. **A map layout.** A wide world, 16:9, with coloured territories. Each main branch of the field is one territory. Foundations sit as bedrock under the map, open problems sit at the edges, and philosophy or ethics floats above as a cloud. Every item has a position, a cartoon icon, an all-caps label and an optional one-line sub-label.
3. **Icons.** Chunky cartoon doodles with thick black outlines and flat bright fills. The starter library covers many common ideas. Draw new ones only for ideas it does not cover.
4. **Narration audio.** A local neural TTS voice. Each segment is its own clip, and the clip lengths drive all the timing.
5. **The render.** A browser page draws the map. The camera glides between targets, each item pops in on its cue word, and regions fade in their colour when the narrator first names them. Parallel workers capture the frames, and ffmpeg joins them with the audio and an optional quiet music bed.

The bundled `engine/` does parts 4 and 5. `examples/map-of-marketing/` is a complete, tested project to copy from. Its script and layout show every feature in use.

## Order of work

1. **Understand the field first.** List its main branches (3–5 territories), its foundations (bedrock), its history (origins in the centre), its crossovers and its open questions. Check each fact you will state: dates, names, numbers. Use hedges such as "reportedly" or "is supposed to have said" where the record is disputed.
2. **Write the script before the layout.** The story decides the map, not the other way round. Follow the script pattern. Keep every term to one plain-language sentence.
3. **Lay out the map.** Put the origins in the centre. Put territories around it, so that the camera tour moves in short hops. Place each region's items near each other, in the order they are spoken. Leave room for big region titles: in a full-map shot, they must be readable.
4. **Generate the narration**, then check it. Transcribe the fastest and slowest clips with a speech-to-text model, and compare them to the script to catch dropped or garbled words.
5. **Review stills before the full render.** The full render takes tens of minutes, so first render stills: the intro, the first region, one dense region, a full overview and the end. Look at each one. Check that labels do not overlap, that titles are readable, that no item sits outside its region, and that the credit line shows.
6. **Render the full video.** Then sample frames from the final file, and check that the video and audio have the same length.

## Constraints

- **Original work only.** Use his *method*: the map metaphor, the pacing, the pop-in reveals. Never copy his maps, drawings, layouts or wording. Draw every map and icon fresh for the subject.
- **Credit is mandatory.** The engine shows a credit line during the intro and the final overview. Also put "Style inspired by Domain of Science (youtube.com/@DomainofScience)" in the video's description wherever it is published.
- **Cue words drive sync.** An item appears at its cue word's position in the segment text, scaled to the clip length. Pick a cue word that the narrator says when the item should appear.
- **Camera framing.** Visible width around 2000 world units for detail tours (labels readable), the full world width for overviews. Long hops need an overview in between, or the viewer gets lost.
- **Hand-drawn feel.** Keep the wobble filter, the hand-lettered font and the thick outlines. Without them, the map looks like a slide deck.
- **One fact, one place.** Each item appears once on the map. To refer back, move the camera back to it. Do not draw it a second time.

## What success looks like

- A viewer who did not know the field can name its main branches, and say what sits under them and what is still unknown.
- Every spoken term pops in on screen within about half a second of being said.
- The final overview shot shows a dense, readable map that could work as a poster.
- The credit to Domain of Science shows on screen and in the description.
