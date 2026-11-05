# Programming for AI guest lecture: vLLM and Patram-Ingest

A 77-slide animated HTML deck (1920×1080). Core path about 77 minutes; the bit-mask deep dive adds about 8.

Present from **`dist/programming-for-ai-lecture.html`**. It is one self-contained file, so it works offline. Script: `SPEAKER_NOTES.md`.

| Key | Does |
|---|---|
| → / Space / click right | next step, then next slide |
| ← / click left | back |
| P | presenter window: notes, next slide, clock and pace |
| O | overview grid · F fullscreen · T clock · B blackout · R reset clock |

Deep dive: the button on the "dynamic DAG" slide opens seven bit-mask slides; next from the last one returns to the talk.

## Structure

An introduction (what we do, scale, one training example, the idea, the agenda) comes first. Parts 1 to 4 are vLLM (Why it is hard, The vLLM engine, Engine features, Serving at scale). Parts 5 to 8 are Patram-Ingest (Around vLLM, Busy GPUs, Crash safe, Graphs). Part 9 is the wrap-up.

## Editing

One file per slide in `src/slides/`, in filename order. New vLLM code is `src/js/anim-20-vllm.js` and `src/css/slides-x1.css`. Rebuild with `python3 tools/build.py`. Screenshots: `tools/shot.py`, `tools/allshots.py`.

The vLLM half follows Aleksa Gordić, *Inside vLLM* (August 2025, commit 42172ad), and the PagedAttention and Orca papers.
