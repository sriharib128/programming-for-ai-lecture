# Programming for AI guest lecture: vLLM and Patram-Ingest

A 52-slide animated HTML deck (1920×1080). Core path about 49 minutes; the bit-mask deep dive adds about 8.

Present from **`dist/programming-for-ai-lecture.html`**. It is one self-contained file, so it works offline. Script: `SPEAKER_NOTES.md`.

| Key | Does |
|---|---|
| → / Space / click right | next step, then next slide |
| ← / click left | back |
| P | presenter window: notes, next slide, clock and pace |
| O | overview grid · F fullscreen · T clock · B blackout · R reset clock |

Deep dive: the button on the "dynamic DAG" slide opens seven bit-mask slides; next from the last one returns to the talk.

## Structure

An introduction (what we do, scale, one training example, the idea, the agenda) comes first. Parts 1 and 2 are a short, non-technical tour of vLLM (Why it is hard, How vLLM works). Parts 3 to 6 are Patram-Ingest (Around vLLM, Busy GPUs, Crash safe, Graphs). Part 7 is the wrap-up.

## Editing

One file per slide in `src/slides/`, in filename order. New vLLM code is `src/js/anim-20-vllm.js` and `src/css/slides-x1.css`. Rebuild with `python3 tools/build.py`. Screenshots: `tools/shot.py`, `tools/allshots.py`.

The vLLM part draws on Aleksa Gordić, *Inside vLLM* (August 2025), and the PagedAttention paper. The longer technical vLLM version is in git history at commit 7578c0b.
