# Writing the narration script

The script is the spine of the video. Each segment is one or two sentences, and is its own TTS clip. The clip's length sets how long the camera stays and when items pop in.

## Segment fields (what each one means)

- **text:** what the narrator says. Write numbers and acronyms the way they should be spoken ("forty four percent", "S T P"). A speech-fixes map can rewrite words that the voice mispronounces.
- **show:** the items this segment reveals, each with its cue word. The item pops in where the cue word sits in the text. If two items share a sentence, give each its own cue, so they appear one after the other.
- **cam:** where the camera goes. Either the item ids to frame, or an explicit centre and width. Leave it empty to stay put; the camera then drifts slowly.
- **regions:** territories that fade in their colour during this segment. Introduce each territory once, in the "split" section.
- **scene:** the cold open is a separate screen-space scene. The map scene starts with a crossfade.
- **pause:** silence after the clip. Use longer pauses after the title and the final line.

## Rules that make it teach

- **Define, then example.** "Segmentation is splitting a market into groups with similar needs." Then show a concrete case on screen.
- **One new term per sentence.** If a sentence carries three terms, split it.
- **Say where we are.** Start each territory with a short orientation line ("Next door is Brand.") while the camera moves there.
- **Name the crossovers out loud.** The links between territories are what a map shows best.
- **Put the unknowns at the edges.** End the tour with what nobody has solved yet. It shows the field is alive.
- **Hedge disputed facts** ("is supposed to have said", "reportedly"). Check each date, name and number before you narrate it.
- **End on meaning, not a summary.** One or two sentences on why the field matters, with the full map on screen.

## Budget

- Hook and origins: about 1.5 minutes.
- The split: about 30 seconds.
- Each territory: 1.5–2.5 minutes.
- Edges and outro: about 1.5 minutes.
- The total is 8–12 minutes. Beyond that, the map gets too dense to read in the final shot.
