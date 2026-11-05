# Programming for AI guest lecture: speaker notes

Generated from the deck. Keys: → next · ← back · F fullscreen · O overview · P presenter window · K skip optional slides · T clock · B blackout.

| # | Slide | min | cumulative (core path) |
|---|---|---|---|
| 1 | vLLM and Patram-Ingest | 0.3 | 0.3 |
| 2 | What we do: the Patram stack | 0.8 | 1.1 |
| 3 | The scale a foundation model needs | 0.6 | 1.7 |
| 4 | What one training example looks like | 1.2 | 2.9 |
| 5 | A model, the engine that runs it, and the system around it | 1.5 | 4.4 |
| 6 | What we will talk about today | 1 | 5.4 |
| 7 | Part 1 · Why running a model is hard | 0.2 | 5.6 |
| 8 | A model produces one token at a time | 1.5 | 7.1 |
| 9 | Saving earlier work avoids repeating it | 2 | 9.1 |
| 10 | Requests finish at different times | 2 | 11.1 |
| 11 | Reserving for the longest answer wastes memory | 1.5 | 12.6 |
| 12 | Your turn: where have you seen this problem? | 2 | 14.6 |
| 13 | vLLM began with that idea | 0.8 | 15.4 |
| 14 | Part 2 · How vLLM works | 0.2 | 15.6 |
| 15 | The engine is one loop with three steps | 1 | 16.6 |
| 16 | Memory is handed out in small blocks | 2 | 18.6 |
| 17 | What vLLM handles, and what is left to you | 1 | 19.6 |
| 18 | Part 3 · The system around vLLM | 0.2 | 19.8 |
| 19 | Three things that interrupt a weeks-long run | 1.2 | 21.0 |
| 20 | Three requirements for the engine | 0.8 | 21.8 |
| 21 | Part 4 · Keeping the GPUs busy | 0.2 | 22.0 |
| 22 | The model run is one of three steps | 1 | 23.0 |
| 23 | Inside one node | 1.1 | 24.1 |
| 24 | Processes, threads and event loops | 1.5 | 25.6 |
| 25 | Your turn: which parallelism where? | 0.8 | 26.4 |
| 26 | What we chose for each piece | 1 | 27.4 |
| 27 | Sharing work through one queue | 1.1 | 28.5 |
| 28 | A private inbox per worker | 1.1 | 29.6 |
| 29 | A worker can run any backend | 1 | 30.6 |
| 30 | Part 5 · Crash safe | 0.2 | 30.8 |
| 31 | Nodes take work from one table | 1.6 | 32.4 |
| 32 | Recovery and scaling without intervention | 3.2 | 35.6 |
| 33 | Every error is followed through | 1 | 36.6 |
| 34 | Part 6 · Graphs of stages | 0.2 | 36.8 |
| 35 | One pipeline, a different route for every page | 1.2 | 38.0 |
| 36 | The whole pipeline is a graph | 2 | 40.0 |
| 37 | A dynamic DAG fits our workloads | 0.8 | 40.8 |
| 38 | Stages need a shared record of each page *(deep dive)* | 0.7 | - |
| 39 | The record is one switch per stage *(deep dive)* | 0.8 | - |
| 40 | Two rows per page: Finished and Ready *(deep dive)* | 0.8 | - |
| 41 | Following one page through the graph *(deep dive)* | 2.2 | - |
| 42 | When the sweep lets a stage start *(deep dive)* | 1.1 | - |
| 43 | Ready makes a stage start exactly once *(deep dive)* | 1 | - |
| 44 | A crash between writes never loses a page *(deep dive)* | 1.2 | - |
| 45 | From idea to a running pipeline | 0.8 | 41.6 |
| 46 | All stages at once | 1.2 | 42.8 |
| 47 | What Patram-Ingest supports | 0.6 | 43.4 |
| 48 | Scaling compared with DBOS and Temporal | 1.5 | 44.9 |
| 49 | Key takeaways | 1 | 45.9 |
| 50 | The DB is the single source of truth | 0.8 | 46.7 |
| 51 | Where Patram-Ingest sits in the stack | 1.2 | 47.9 |
| 52 | Thank you | 0.6 | 48.5 |


**Core path ≈ 48.5 min.** The bit-mask deep dive (reached from the button on the dynamic DAG slide) adds the remainder.

## 1. vLLM and Patram-Ingest
*Introduction · ~0.3 min · no steps*

Hello everyone, and thank you for having us. We are Anirudh and Srihari, from the Vision team at BharatGen. Before we get to the topic, a few minutes on what we do, because it explains why we care about it.

## 2. What we do: the Patram stack
*Introduction · ~0.8 min · no steps*

What we do: the Vision team at BharatGen builds sovereign vision foundation models for Indian documents. The model reads the page image directly, so layout, tables and stamps are not lost on the way.

This is our stack as a pyramid, read from the bottom up. At the base is storage: our own file system and database. On it, we collect raw data, scraped and synthetic documents, and beside that sits our annotation and visualization tool, DarshinAI. Above that is training data generation: that is Patram-Ingest, which we cover after vLLM, which turns raw pages into training data. Then the training infrastructure. Then the models, the Patram Suite, shown on the right: multi-task foundation models, the Patram series, the current one covering 34 tasks and the next adding more than 22 Indian languages; task-specific models for grounding, layout and grounded reasoning; and agents such as PatramParse. At the top, evaluation measures all of it. Everything above the ETL layer is trained or measured on data Patram-Ingest produced.

## 3. The scale a foundation model needs
*Introduction · ~0.6 min · no steps*

This is the scale a foundation model needs, and the scale we work at: more than 100 terabytes of image data, more than 100 million training examples, more than 100 billion tokens of model output, generated on more than 500 GPUs. For Patram 1.5 alone it was more than 50 million examples and 41 billion tokens, and every release needs more.

At that size, generating the data is not a script you run overnight. It is a workflow that has to keep going, without interruption, for weeks. Hold on to that phrase; we come back to it after vLLM.

## 4. What one training example looks like
*Introduction · ~1.2 min · no steps*

What does a model actually learn from? Examples, millions of them. Here is one. The input is the image of a page, here an electricity bill. The example pairs it with a question, "What is the payment due date?", the answer, "15 July 2015", and where on the page the answer is: the orange box. A model that sees millions of these learns to read documents and to point at its evidence.

Who writes these? Not people: there are far too many. They are made automatically, in a chain. One model understands what the page is. Another writes a question. Another answers it from the page. And a last one verifies the answer against the page. Each call needs the output of the one before.

The same page also teaches other things: reading all its text, finding the tables, turning a table into rows. Now multiply by a hundred million pages, in more than 22 languages. That is the workload behind today's lecture.

## 5. A model, the engine that runs it, and the system around it
*Introduction · ~1.5 min · reveal steps: 2*

So how do you get from a model to that scale? Here is the idea of the lecture as one picture. Start in the middle, with what you already know: you give a model some tokens, and it gives you the next one.

**[step 1]** Around the model sits an engine. vLLM is the one we use, built by a large community of experts. It takes many requests from many users and runs them on one model without wasting the hardware. Parts 1 and 2 look inside this box, briefly.

**[step 2]** Around that sits the system that actually uses the engine. Ours is Patram-Ingest. It decides which prompt to send, tracks every sample, and keeps a run going for weeks on a cluster where machines fail. Parts 3 to 6 are about this box. You are unlikely to rewrite vLLM, but you will very likely write a system like the outer one. Next, the agenda.

## 6. What we will talk about today
*Introduction · ~1 min · no steps*

Here is the plan. We start with vLLM, and we keep it short. Why is running a model for many people hard at all, and how does vLLM solve that? We leave out most of its features, because the ideas are what matter.

Then comes most of the lecture: Patram-Ingest, the system we built around vLLM to generate the training data you just saw. We explain what can interrupt a run that lasts for weeks, and then three problems in turn: keeping the GPUs busy, losing no work when machines die, and sending each page through many models on its own route.

Please interrupt us at any time; this works better as a conversation. A few slides will ask you for an answer, so stay ready. Let us start with Part 1.

## 7. Part 1 · Why running a model is hard
*1 · Why it is hard · ~0.2 min · no steps*

Part 1. We start with how a model writes an answer. Then we see why that gets hard as soon as many people want to use it.

## 8. A model produces one token at a time
*1 · Why it is hard · ~1.5 min · no steps*

This is how a model writes an answer. A token is a word or a piece of a word. The model reads everything so far, predicts one new token, adds it to the end, and starts again until the answer is done.

Watch the counters. Each pass gives one token, and each pass reads everything again. It is like re-reading a whole book from page one before writing every new word.

Ask the room: what work is being repeated here?

## 9. Saving earlier work avoids repeating it
*1 · Why it is hard · ~2 min · reveal steps: 1*

For each token, the model works out some numbers. The numbers for old tokens never change, so working them out again is a waste. On the left, nothing is saved: 45 computations for 6 new tokens.

**[step 1]** So we save them, like taking notes instead of re-reading the book. Those numbers are called keys and values, so this is the KV cache. You do not need the details, only this: the same 6 tokens now take 10 computations. Keep the last line in mind. The cache lives in GPU memory, and it grows with every token. Most of what follows is about this one piece of memory.

## 10. Requests finish at different times
*1 · Why it is hard · ~2 min · reveal steps: 1*

A GPU can work on many requests at once, so we batch them. Here are 8 requests and room for 4 at a time. Each column is one pass of the model. The first idea: take four, run until all four are done, then take the next four.

Watch the hatched cells. A short request finishes, but its place stays empty until the longest one is done. Think of a restaurant that seats nobody new until the whole room has finished eating.

**[step 1]** The fix: when a request finishes, the next one takes its place straight away, like seating the next guest as soon as a table is free. This is called continuous batching. The same requests finish much earlier on the same hardware.

But requests now come and go at every pass, and each one has a cache that grows. Where does all that memory go?

## 11. Reserving for the longest answer wastes memory
*1 · Why it is hard · ~1.5 min · reveal steps: 2*

The simple approach is one piece of memory per request. But we do not know how long an answer will be, so we reserve room for the longest it could be. It is like booking a hall for 16 people every time, even if 5 turn up. A has used 5 places and B has used 6.

**[step 1]** Request C arrives. It needs 16 places in one piece, and only 8 are left. So C waits, even though most of the memory holds nothing.

**[step 2]** This is not a small effect. The authors of vLLM measured existing systems, and only about 20 to 38 percent of this memory held real data.

## 12. Your turn: where have you seen this problem?
*1 · Why it is hard · ~2 min · reveal steps: 1*

Forget about GPUs for a moment and read these four lines. Ask the room: you have met this exact problem before. In which course? Take a few answers.

**[step 1]** Operating systems. An OS splits memory into small pages. A program's pages can sit anywhere, and it gets a new page only when it needs one. The program still sees one continuous range.

The vLLM authors used the same idea for the KV cache. A request's memory is split into small blocks that can sit anywhere, and it takes a new block only when the last one is full. Nothing is reserved in advance. They called it PagedAttention. So an idea from your operating systems course made a large difference in AI.

## 13. vLLM began with that idea
*1 · Why it is hard · ~0.8 min · no steps*

That idea became vLLM. The original paper reported two to four times the throughput of the best systems of the time, without making each request slower. It started at UC Berkeley, and today more than two thousand people have contributed to it. This is the system built by experts that we mentioned at the start.

If you want the details, read the walkthrough by Aleksa Gordić after this lecture. We leave out almost all of it today.

## 14. Part 2 · How vLLM works
*2 · How vLLM works · ~0.2 min · no steps*

We now know the problems. Here is how vLLM puts the answers together. We keep this simple: one loop, and memory in small blocks.

## 15. The engine is one loop with three steps
*2 · How vLLM works · ~1 min · no steps*

The whole engine is this one loop, and it is the same idea you saw at the start of Part 1, only for many requests at once.

First it picks: which requests take part in this pass, and do they have memory? Then it runs the model and gets one new token for each. Then it cleans up: it adds the tokens and checks whether any request is finished. A finished request gives its memory back immediately.

Because the picking happens again on every pass, a new request can join on the very next one. That is continuous batching, and you can see it needs no special machinery. It follows from this loop.

## 16. Memory is handed out in small blocks
*2 · How vLLM works · ~2 min · no steps*

Here is everything together. On the left are five requests. On the right is GPU memory, split into blocks, and each dot is one token's saved work. Each tick is one pass of the loop.

Each request takes a block only when it needs one. Watch the colours mix: a request's blocks are not next to each other, and that does not matter.

When a request finishes, its blocks are free immediately, and a waiting request joins on the next pass. Nobody waits for a batch to end, and no memory is reserved for tokens that do not exist yet. Those were our two problems, and this one picture solves both.

## 17. What vLLM handles, and what is left to you
*2 · How vLLM works · ~1 min · reveal steps: 1*

That is the system experts built, and using it takes one command to start a server. It does much more than we showed, and if you are curious, the Inside vLLM walkthrough is the place to read about it. We could not have built this ourselves, and we did not need to.

**[step 1]** But look at what happens when you have a real job to do. In our case, generating training data from a hundred million pages. vLLM does not know that. It sees one request at a time. Which prompt comes next, whether an answer is usable, what happens to a page when a node dies: none of that belongs in an engine. That is a second program, and you have to write it. It is also the program you are most likely to write yourself. That is Patram-Ingest.

## 18. Part 3 · The system around vLLM
*3 · The system around vLLM · ~0.2 min · no steps*

The rest of the lecture is about one real system built around vLLM. You saw at the start what we use it for: training data at a very large scale. First, why that needs more than a fast model server, and then the design, in three parts.

## 19. Three things that interrupt a weeks-long run
*3 · The system around vLLM · ~1.2 min · no steps*

At the start we said a run must keep going for weeks. On a real cluster, three things get in the way, and the engine has to handle all three by itself.

One: nodes die and restart. Over weeks, nodes crash, reboot, run out of memory or are taken back. The run has to recover on its own: notice what died, restart it, and carry on, without a person watching.

Two: GPUs are lent out. The cluster is shared, so we sometimes lend GPUs to another team for a while. The run should carry on with fewer, and when the GPUs come back it should scale up and use them again on its own, without a restart.

Three: complex workloads need pipeline parallelism. A page goes through several model steps, and we want every step running at the same time, with steps spread over different nodes.

If asked whether this really happens: in one run, nine of 24 nodes stopped working, and nobody noticed for six hours, because nothing was in place to notice.

## 20. Three requirements for the engine
*3 · The system around vLLM · ~0.8 min · no steps*

From those problems come three needs, and we take them in order.

First, busy GPUs. The GPUs are the expensive part of the cluster, and Part 4 is about never letting them wait for anything: not the host, not the disk, not another step.

Second, crash safety. Nodes die and GPUs come and go, and when the dust settles the output must still hold every record exactly once, without a person cleaning up. That is Part 5. Normally this need is expensive, because engines that survive crashes write every step to a database; Part 5 shows how we avoid that.

Third, any workflow with very little code. Once someone can picture a pipeline, with steps that branch and merge on what the data contains, getting it running across every node should take a few lines of code and one command. Coordination, retries and scaling should come for free. That is Part 6.

First, busy GPUs.

## 21. Part 4 · Keeping the GPUs busy
*4 · Keeping the GPUs busy · ~0.2 min · no steps*

We have the problem and the three needs. We take the first one first: how to keep the GPUs busy. This is the part where we build up from first principles: what a GPU is waiting for, and how a program should wait.

## 22. The model run is one of three steps
*4 · Keeping the GPUs busy · ~1 min · reveal steps: 1*

Start with what the GPU actually does. For every batch of pages, the model run is one step. Before it, the host has to build prompts and read and check images. After it, the host has to parse and validate the answers, write them to disk and record that they are done. The GPU does only the middle part.

**[step 1]** Two ways to run the same four batches, on one clock. Press play, or drag the slider. Top: one batch at a time. The host prepares, then the GPU runs, then the host finishes, and the GPU sits idle while the host works. Bottom: overlapped. The host prepares the next batch and finishes the last one while the GPU runs this one. The same host work is still done, but none of it is on the GPU's critical path, so the whole run ends sooner and the GPU lane is continuous. So the question is not how to make the host faster; it is how to make sure the host is always one batch ahead. That means many pieces of host code running at the same time as the GPU. Next: what those pieces are.

## 23. Inside one node
*4 · Keeping the GPUs busy · ~1.1 min · no steps*

Here is what runs on every node, before we talk about how. Every node runs the same program; there is no master node.

On the left, the orchestrator process. It has four jobs. Prepare claims samples and builds the model requests. Collect gathers the results as they come back. Write saves them to disk and then marks them done. Upload moves finished files to the object store.

In the middle, the worker pool: the worker processes that run the models. A dispatcher hands each request to a worker. There is one worker per model server, GPU, browser or CPU slot, and each worker calls a backend. A supervisor restarts any worker that dies.

On the right, the backends a worker can call: vLLM servers, Hugging Face models, a CPU process such as page rendering, or any classic model such as SAM3 or YOLO. And around everything, a small watcher restarts the whole program if it exits or the node reboots.

All of these pieces must run at the same time, or the GPU waits, as we just saw. So for each one we have to choose the right kind of parallelism, and there are three options.

## 24. Processes, threads and event loops
*4 · Keeping the GPUs busy · ~1.5 min · no steps*

This is the part of the lecture that is most directly about programming. First, the basics. There are three ways to have a computer do many things at once, and each is good at one thing.

A process is a separate program with its own memory and its own Python interpreter. Processes really run in parallel, even Python code, and if one crashes the others keep going. The cost: they are heavier, and data has to be copied between them. So processes are for CPU-heavy work, for anything that might crash, and for anything that owns a GPU.

Threads are helpers inside one program. They are the easy option, because they share memory: handing a result to another thread is just passing an object, nothing is copied. The catch in Python is the GIL: only one thread runs Python at a time. That is fine while a thread is waiting on the disk, the network or the database, because waiting releases the GIL, but it is bad for CPU work. And a crash takes the whole program down. So threads are for waiting.

An event loop is one thread that juggles many waits. Each call starts, waits for its answer, and while it waits the loop runs the others. Hundreds of calls can be in flight almost for free, and there are no locks because only one thing runs at a time. But one slow step that does not wait properly blocks every call. So event loops are for many model calls at once.

Rule of thumb, under each column: computing, a process; waiting, a thread; many waits at once, an event loop.

## 25. Your turn: which parallelism where?
*4 · Keeping the GPUs busy · ~0.8 min · no steps*

You just met the three options: process for computing, thread for waiting, event loop for many waits. Here is the node again. Every one of these boxes has to run at the same time. Over to you: which ones would you make processes, which threads, and which an event loop? A hint: ask of each box whether it computes, whether it mostly waits, or whether it juggles many calls at once. Take a few answers from the room before moving on.

## 26. What we chose for each piece
*4 · Keeping the GPUs busy · ~1 min · no steps*

Here is what we chose: the same picture, coloured by kind.

Processes, in blue: the orchestrator, the worker pool, and each worker. These do CPU work in Python, such as checking images and handling JSON, so they need their own interpreter. A crash, for example an out-of-memory kill, takes down one process and nothing else. And a GPU is owned by exactly one process. We learned this the hard way: early versions ran the model in the same process as the rest of the pipeline, and the shared interpreter lock was the first bottleneck.

Threads, in purple: inside the orchestrator, prepare, collect, write and upload are threads, and in the pool so are the dispatcher and the supervisor. They spend their time waiting on the database, on fsync or on the network, and waiting releases the lock, so threads overlap well. Handing a result from one to the next is just passing an object.

Event loops, in orange: inside each worker, one asyncio loop keeps many calls in flight, for example 24 requests per vLLM server, each handled as its answer arrives. One thread, no lock, many waits.

## 27. Sharing work through one queue
*4 · Keeping the GPUs busy · ~1.1 min · reveal steps: 1*

We now have several workers, and requests to hand out. How do we balance the load between them? The easiest way is one shared queue: put every request in it, and let each worker pull the next one when it is free. A fast worker simply pulls more often, so the load balances itself.

Look at what a pull does inside. The worker takes the queue's lock, pulls one request, and releases the lock. Only one worker holds the lock at any moment; you can see it passing between them.

**[step 1]** Now a worker is killed, for example by an out-of-memory kill, at the moment it holds the lock. A killed process runs no cleanup, so the lock is never released. Every other worker is now waiting for a lock that nobody will ever give back. The supervisor restarts the dead worker, and the new one waits on the same lock. So the pool reports itself healthy, with every worker alive, but throughput is zero. There is no error and no timeout; the run just stops. This happened to us: in a test that killed one of two workers mid-request, the pool hung in three of eight trials.

## 28. A private inbox per worker
*4 · Keeping the GPUs busy · ~1.1 min · reveal steps: 2*

The fix is not a safer lock. Holding a lock when you are killed is how the primitive works. The fix is to take the shared lock away from anything that can be killed. One dispatcher, a thread in the pool, is the only reader of the shared queue. It hands each request to a free worker by putting it in that worker's own inbox. Each worker reads only its own inbox.

**[step 1]** Now kill a worker. The worst it can do is block its own inbox, and that inbox is thrown away with it. The dispatcher sees the worker is gone and stops sending to it. The other workers never shared anything with it, so they keep working.

**[step 2]** The supervisor starts a new worker with a fresh, empty inbox, and the requests the dead worker owed come back as system errors and are sent again. The rule we took from this: never share a lock with a process that can die. Since the change, the same kill test has not hung once, and with one of four workers killed all 40 test images were committed. One limit we state honestly: results still travel back on shared queues, so the same kind of failure is possible there, in a much narrower window.

## 29. A worker can run any backend
*4 · Keeping the GPUs busy · ~1 min · no steps*

So what actually runs inside one of those worker processes? Anything that fits three functions: initialise, call and terminate. The pool, the inboxes, the supervisor and the error handling are the same whatever the backend is.

Most of our work calls hosted vLLM servers over HTTP: shared servers that many pipelines use, so an ingestion node needs no GPU of its own. A worker can also load a Hugging Face model on the node's own GPU, do CPU work such as rendering pages in a headless browser, or run vision models such as SAM3 and YOLO.

vLLM itself got here in steps. We started with batch generate inside the pipeline process, moved to vLLM's async engine for continuous batching, then found its outputs differed from vllm serve with the same arguments, so we now drive vllm serve over HTTP, and finally shared hosted servers. The lesson from that path: run the model the way vLLM itself serves it.

## 30. Part 5 · Crash safe
*5 · Crash safe · ~0.2 min · no steps*

Busy GPUs are only useful if the work survives. Part 5 is how the engine stays crash safe: it loses nothing and repeats nothing, even when processes and machines die.

## 31. Nodes take work from one table
*5 · Crash safe · ~1.6 min · no steps*

Busy GPUs are only useful if the work survives, so start with how many nodes share one run, with as little overhead as possible. Nodes do not talk to each other and there is no coordinator. Each step's queue is a table in the DB with one row per sample, drawn here as one box per image, and each row has a state: waiting, claimed, done or failed. A node that wants work sends the database one command that picks a few waiting rows, marks them as its own and writes its name on them, all in one step. A second node making the same request at the same instant skips those rows, so two nodes can never get the same image. Nothing is assigned in advance, so a fast node simply takes more work. Click the steps, or press next, to walk through one run.

**[step 1]** Nodes A and B each ask the queue for a batch of images. Each batch takes its node's colour, and the node works on it.

**[step 2]** Now node B crashes in the middle of its batch. Its images are marked as claimed by a node that no longer exists. Recovery hands them back to waiting, so nothing is lost.

**[step 3]** Node C arrives and claims exactly those images, and the run carries on as if nothing happened.

**[step 4]** Node D joins later. One image that cannot be read is marked failed without stopping the rest, and the table finishes with every image done once. To grow a run you start the same program on more nodes; to shrink it you stop some. The DB is deliberately one plain database on one machine, because every extra component is another way to fail.

## 32. Recovery and scaling without intervention
*5 · Crash safe · ~3.2 min · reveal steps: 8*

Back to the first two problems from the start: nodes die, and GPUs come and go. The run handles both without anyone stepping in: it recovers, and it scales. First, recovery.

**[step 1]** The idea is simple: each layer is restarted by the layer around it. Click any of the three cases on the right to play it. Inside one node, workers live inside a supervisor, the supervisor lives inside the program, and a small watcher script sits around the program. The vLLM server has its own watcher too.

**[step 2]** A worker dies. The supervisor notices and starts a new one in its place, and the requests that worker had are sent again.

**[step 3]** The whole program stops, or the node reboots. The watcher starts the program again. Whatever samples it had claimed and not finished go back to the table, and any node can pick them up.

**[step 4]** A vLLM server crashes. Its own watcher restarts it, and the requests that were waiting on it go back to the queue. In every case nobody is paged and no work is lost.

**[step 5]** Now scaling, in three steps. Step one: all the servers are up. The key decision: pipelines don't own models. The cluster runs model servers on every machine, and the pipeline just uses whichever are serving. We even launch the run before any server is up: it just waits. Every 30 seconds the run checks which servers are serving, and starts one worker per serving server. No restart, no configuration. Every worker fetches samples from the database and sends them to its server.

**[step 6]** Step two: a colleague borrows servers 3 and 4. Their workers do not die: they drain, sending the samples they had not finished back to the database, and then they wait. Everyone else carries on.

**[step 7]** Step three: the servers come back, and those workers start again and fetch from the database. Nothing was lost and nobody restarted anything. You can click the steps, pause, or drag the slider.

**[step 8]** Here is what that looks like over one day, as in our blog; the shape is illustrative. One: we launched before the models were up, and work started as each server came online. Two: a colleague borrowed GPUs; the workers using them drained and waited. Three: the test finished, and those workers fetched from the database again. Four: a server crashed; its requests went back and it restarted. Five: free GPUs appeared and the run spread onto them. Nobody touched the run all day.

## 33. Every error is followed through
*5 · Crash safe · ~1 min · no steps*

At production scale, something fails every minute, and every error has to be followed through to the end: no error is dropped, and none is left vague. To do that, every error is sorted, where it happens, into one of two kinds.

In the first kind, the sample itself is the problem: a corrupt image, an image too large for the model, a file that cannot be read, an answer that still does not parse after a retry with a stricter prompt. Retrying again would only waste time. So we discard it: mark it failed and record the reason.

In the second kind, the system or the infrastructure is at fault: a server crashed, a process ran out of memory or was killed, the network dropped, a server was put to sleep. The sample is fine, so it must never be marked failed. It is retried, on another node or at a later time. And if everything is failing at once, the run pauses instead of failing samples.

When it is unclear, treat it as the system's fault, because the two mistakes do not cost the same: a retry costs seconds, but a good sample thrown away is lost for good. The result is a dataset where every missing sample has a recorded reason, and none are missing because of an outage.

*If asked: a fuse stops the whole run, failing nothing, after max(2b, 64) consecutive infrastructure failures with no success; and a request that fails as infrastructure more than five times while others succeed is failed as itself. Before this classification existed, a dead backend marched whole datasets into the failed state.*

## 34. Part 6 · Graphs of stages
*6 · Graphs of stages · ~0.2 min · no steps*

Until now we treated a stage on its own. But a good training example is never the work of one model. Part 6 is how a page moves through many models, each page on its own path, and how the engine runs that across machines without a coordinator.

## 35. One pipeline, a different route for every page
*6 · Graphs of stages · ~1.2 min · no steps*

Here is the problem Part 6 solves. A good training example is never the output of a single model. Six pages enter the same pipeline of seventeen agents. Understand reads each page and decides where it goes next, and later agents keep deciding too.

A chart is read, then re-read by a second model to catch wrong numbers. A table is rebuilt as HTML and rendered in a browser to check it matches. A form has one field hidden, so the questions test whether the model notices it is missing. A text page goes through key-fact extraction, and if Verify rejects the answer a larger teacher model writes the final one. A scan is straightened first, then handled like any text page. A blank page is dropped straight away, so no expensive stage runs on it.

All six run together, each on its own route. You can click any page to replay just its route; the line at the bottom shows the route it took, which every output records.

## 36. The whole pipeline is a graph
*6 · Graphs of stages · ~2 min · reveal steps: 4*

Put all those routes together and you get one graph. A page enters at the left. Each box is a model, a tool or a check. Three rules decide where a page goes and when a box may start, and we will zoom into each.

**[step 1]** One: routing. After Understand finishes a page, a small function written by the pipeline author looks at what it found and picks the next box for that page. A chart goes to the chart reader, a table to the table reader, a formula to the LaTeX writer. A text page goes to two boxes at once, transcription and layout. It can also pick none: a blank page simply stops.

**[step 2]** Two: needs both. Some boxes need several inputs. Grounded question answering needs both the transcribed text and the layout of the same page. Watch the label: the text arrives first, so it keeps waiting for the layout. When the layout arrives, it starts, exactly once. It does not matter which finished first or on which machine. Solid lines mean every input is needed.

**[step 3]** Three: either one is enough. Write a question takes a table or a chart. A page is never both, so the table reader's input will never come for a chart page; waiting for both would wait forever. So it starts as soon as one input is done. Dotted lines mean one input is enough.

**[step 4]** Three rules: route the page, needs every input, one input is enough. Every pipeline we run is built from these.

## 37. A dynamic DAG fits our workloads
*6 · Graphs of stages · ~0.8 min · reveal steps: 1*

Look at the pipelines we build. Every one of them has three things. It is a graph, declared once in code: each stage names its inputs, and the engine works out who feeds whom. Acyclic: no loops. Verification loops are common, but a cycle makes it impossible to say when a sample is finished, so a retry is a bounded decision inside a routing function, with a counter so it cannot go on forever. And dynamic: the graph is fixed, but each sample's route through it is decided while it runs, from what earlier stages found.

**[step 1]** Put the three together and you get the conclusion: a dynamic directed acyclic graph fits almost every workload we have. Straight chains, branches by content, merges and early exits are all special cases of that one shape, so the engine only has to run one thing well. If the room wants to know how the engine tracks each page through such a graph, the Deep dive button opens seven slides on that; otherwise carry on.

## 38. Stages need a shared record of each page (deep dive)
*6 · Graphs of stages · ~0.7 min · reveal steps: 2*

We now go one level deeper: how does the engine actually run a graph like the one we just saw, on many machines? Here is the difficulty. Every stage is its own process, often on a different machine, and they share no memory.

**[step 1]** They also never send messages to each other. That is deliberate, it is the same rule as before: no coordinator process that can crash and take the run with it. But it means that when Text finishes a page on machine 3, nobody tells Grounded Q&A.

**[step 2]** So the engine keeps one small record for every page that is in flight, in the DB. Every stage reads it and writes to it. All the coordination between stages happens through this record. The next slides show what is in it. It is only two numbers.

## 39. The record is one switch per stage (deep dive)
*6 · Graphs of stages · ~0.8 min · reveal steps: 2*

Every stage in a graph gets a position, like a seat number: Understand is seat 0, Text is seat 1, Layout seat 2, Grounded Q&A seat 3. For each page, the record has one switch per seat. A switch is a bit: it is either 0 or 1, off or on. At the start they are all off.

**[step 1]** A switch that is on means yes for that stage. This row says: yes for Understand, yes for Text, no for Layout, no for Grounded Q&A. We will say what the question is on the next slide.

**[step 2]** The useful trick is that a row of switches can be stored as one ordinary number. Give each seat a value: seat 0 is worth 1, seat 1 is worth 2, seat 2 is worth 4, seat 3 is worth 8. Add up the switches that are on, 1 plus 2, and this row is the number 3. That is all a bit mask is: a row of switches kept as a single integer. It is tiny, it is cheap for the DB to store, and the DB can update one switch without touching the others.

## 40. Two rows per page: Finished and Ready (deep dive)
*6 · Graphs of stages · ~0.8 min · reveal steps: 2*

Each page gets two such rows, so two numbers. The first is Finished: which stages have finished this page. It starts empty and fills up as the page moves through the graph.

**[step 1]** The second is Ready: which stages are allowed to start on this page, meaning the page is now waiting in that stage's queue. These two rows are the entire record.

**[step 2]** In the DB it is one row per page: the page, the Finished number and the Ready number. A new page starts with Finished at 0, nothing done, and Ready at 1: only seat 0, Understand, may start. When a page has finished its last stage the row is deleted, so the record only ever holds pages that are in flight, not the whole dataset.

## 41. Following one page through the graph (deep dive)
*6 · Graphs of stages · ~2.2 min · reveal steps: 5*

Let us follow one page through a small graph, with the record on the right. Understand feeds Text and Layout, and Grounded Q&A needs both of them. Text runs on node 3, Layout on node 7, different machines.

One: a page arrives. Finished is 0, nothing is done. Ready is 1, only Understand.

**[step 1]** Two: Understand finishes. Its routing function says this is a text page, so the page goes to both Text and Layout at once. The engine switches on Ready for those two stages, and last of all switches on Understand's own Finished. Watch the numbers: Finished becomes 1, Ready becomes 7, which is 1 plus 2 plus 4. Routing is immediate: it depends on what the page contains, and the stage hands the page straight on.

**[step 2]** Three: Text finishes on node 3. Finished is now 3. Grounded Q&A needs both Text and Layout. Layout is not finished, so nothing starts. There is no message, nobody waits on a phone call. The record just says what is done.

**[step 3]** Four: minutes later, Layout finishes on node 7. Finished is now 7. Both inputs of Grounded Q&A are finished, but nobody has told Grounded Q&A, because stages never talk to each other.

**[step 4]** Five: that is the job of the sweep, a single background process. Every few seconds, five by default, it reads the records, asks for each waiting stage whether its inputs are finished, sees that they are, and switches on Ready for Grounded Q&A. The next slide shows exactly how it decides. Because it only reads the record, it does not matter which machine ran which input, or which finished first.

**[step 5]** Six: Grounded Q&A runs and finishes. It is the last stage, so the page is complete and its row is deleted.

## 42. When the sweep lets a stage start (deep dive)
*6 · Graphs of stages · ~1.1 min · reveal steps: 2*

Here is exactly what the sweep checks. For every stage that has several inputs, the engine keeps a row of the inputs it needs. Grounded Q&A needs Text and Layout: seats 1 and 2, which is the number 6. The sweep takes the page's Finished row and keeps only the switches that are also needed. In the code that is a bitwise AND: Finished AND Needs. Here the page has Understand and Text finished, number 3. Keeping only the needed switches leaves Text alone. The third row does not match the first, so Layout is missing and the stage waits.

**[step 1]** After Layout finishes, Finished is 7. Keeping only the needed switches now leaves Text and Layout, which matches the needs row exactly. Every input is finished, so the stage may start. It does not matter which machine ran which input, or in what order.

**[step 2]** The same row of switches handles the other rule, either one is enough. Write a question takes a table or a chart. A page is never both, so waiting for both would wait forever. For this kind of stage the sweep asks a weaker question: is at least one needed switch on? The chart finished, so yes, start now. Same record, same check, a slightly different question. This is why one mechanism covers every graph shape.

## 43. Ready makes a stage start exactly once (deep dive)
*6 · Graphs of stages · ~1 min · reveal steps: 2*

The sweep does not run once, it runs again and again, every few seconds. So we need to be sure it starts a stage once, not at every pass. Sweep one: Text is finished, Layout is not, so the stage waits. Sweep two: both finished and Ready is off, so the sweep switches Ready on and the page goes into the stage's queue. Exactly once so far.

**[step 1]** Sweep three, four, five: the inputs are still finished, they will always be, so the check still matches. But Ready is already on. The sweep only starts stages whose Ready switch is off, so it skips this one.

**[step 2]** Without the Ready switch, every sweep would match and the stage would start again and again, producing duplicates of the same page, which we would pay for in GPU time and train on. So the two rows divide the job: Finished says what the inputs have done. Ready remembers what has already been started. That is why a stage starts exactly once, whichever order its inputs finish in.

## 44. A crash between writes never loses a page (deep dive)
*6 · Graphs of stages · ~1.2 min · reveal steps: 2*

One more thing we need: crashes. When a stage finishes a page it makes three writes to the DB. It puts the page in the next stage's queue. It switches on Ready for that stage. And it switches on its own Finished. A machine can die between any two of them, so which order do we use? On the right is the reverse order, for comparison.

**[step 1]** Suppose the machine crashes in the middle. In our order, on the left, the page has been handed on but the stage's own Finished is still off. Remember the recovery rule from Part 5: anything not marked finished is picked up and run again. So after the restart the page is run again and the three writes repeat. That is fine because every write is safe to repeat: the queue row already exists, the Ready switch is already on, and switching on a switch twice changes nothing. On the right, Finished is switched on first. Crash straight after, and the record says this stage is finished, so nobody runs it again, while the next stage was never given the page. The page is lost. The same ordering applies when the sweep starts a stage: queue first, then Ready, so a crash between them just means the next sweep does it again.

**[step 2]** So the rule is: hand the page on first, mark yourself finished last, and make every write safe to repeat. It is the same save-first rule from Part 5, applied between stages.

## 45. From idea to a running pipeline
*6 · Graphs of stages · ~0.8 min · no steps*

So a DAG can describe almost any workload we have. And once you define it, running it is very simple. Two parts, then one command.

Part one: you define the DAG. What the stages are, and which ones feed which.

Part two: you define what each stage does: the prompt, and what a good answer looks like.

And you run one command on every machine. After anything goes wrong, you run the same command again. There is no step for recovery, retries, coordination or scaling, because those were designed once and every pipeline shares them. The same engine has run transcription, HTML conversion, chart reading, question answering and dozens of other pipelines. And once the DAG is defined, the engine runs all of its stages in parallel. Here is what that buys.

## 46. All stages at once
*6 · Graphs of stages · ~1.2 min · no steps*

Once the DAG is defined, the engine runs all of its stages at the same time, automatically. Why does that matter? The obvious way is one stage at a time: run stage one over everything, wait, check, then launch stage two. It is simple and it is how most groups start. We did too. This is the same work on the same hardware, twice. Press play, or drag the slider to stop both runs anywhere.

Watch the big number on each side. On top, stage by stage: nothing usable exists until the last stage begins, and a person has to notice each stage finish and launch the next, for days. Below, every stage running at once: each record moves on as soon as it is saved, so finished examples start arriving almost immediately. Both runs finish at the same moment, because they do the same work. What changes is when usable results arrive.

If asked for a measured number: in the paper, a four-stage pipeline over 10 to the 5 pages on 16 emulated nodes produced its first thousand usable records after 10.7 minutes, against 81 minutes stage by stage. The counters on the slide are a simulation of a million examples.

## 47. What Patram-Ingest supports
*6 · Graphs of stages · ~0.6 min · no steps*

Putting it together, this is what the graph layer of Patram-Ingest supports; the cards appear on their own. A graph is a list of stage declarations: each stage names its upstream stages, a policy for waiting on them, and optionally a routing function. Stage authors never see the graph.

It supports any graph shape, declared in a few lines of code: straight chains, fan-out where one stage feeds many, and per-sample routing, where a routing function inspects what a stage produced and returns the stages to send each sample to.

Fan-in with two policies: a stage can need every input, or start as soon as one arrives.

Failure propagation: if a stage fails a sample, every later stage marks it upstream-failed when it next looks, so no stage waits forever for an input that will never arrive; resetting a derived upstream-failed is always safe, which makes fix-and-rerun possible.

Validation at start-up: acyclicity, reachability, routing-target isolation and the split between the two activation paths. And every output records the stages its sample passed through, so any record can be traced through the graph. Bit positions are stored in 64-bit integers; a wider bit string would serve any number of stages. Graphs are acyclic.

## 48. Scaling compared with DBOS and Temporal
*6 · Graphs of stages · ~1.5 min · no steps*

Very few alternatives come close to these features. Among the 13 systems in our comparison, only DBOS and Temporal do: they already survive crashes, route per sample and run across machines. So we ran the same pipeline on both, on the same DB server and the same emulated model servers. We made the servers answer in 20 milliseconds, so inference could not be the limit, and added nodes until throughput stopped growing.

DBOS gained nothing from nodes past 16: about 1,350 pages per second at 16 nodes and at 40. Temporal peaked at 546 on 4 nodes and stayed between roughly 260 and 390 from 8 to 32. In both, the database's replication path was saturated: most DBOS backends were waiting inside a commit for the standby.

Ours kept growing with every added node, to 8,571 pages per second at 32 nodes, which is 6 times DBOS and 28 times Temporal, with the database mostly idle. Why: the database only holds state, a few small rows per page, written in the background in groups; the results themselves go to files on each node, and no node ever waits on another. A driver replaying our statements with no model calls reached over 13,000 pages per second, so the database could give more.

And the overhead stays tiny as nodes are added. Against a bare client that reads prompts from a file and writes answers to local disk, with no database at all, we reach 98.9 to 99.7 percent of its throughput at every scale from 1 to 48 nodes. Throughput grew from 3.88 requests per second on one node to 183.6 on 48, which is 98.6 percent of linear. Caveat: this is one deployment of each system, each configuration ran once, and the servers were emulated.

## 49. Key takeaways
*7 · Wrap-up · ~1 min · no steps*

If you take six things away from the Patram-Ingest half, these are the lessons we learned the hard way.

One: expect failure; it is not an anomaly. Over weeks on a shared cluster, every step will at some point crash in the middle, so design every step for that, instead of treating it as a rare exception.

Two: single responsibility. Every component does exactly one job. A stage only transforms a sample: it does not know the graph, retry, coordinate or scale. Those live once in the engine, which is why a new pipeline is a few lines of code, and why a bug in one stage cannot break recovery.

Three: follow every error through to the end. Every error lands somewhere definite: a system problem is retried, a bad sample is set aside with its reason, and if you cannot tell which, you retry, because a retry costs seconds and a good sample thrown away is gone. Nothing is left stuck in between.

Four: no indefinite waits. A process that is killed while holding a shared lock never releases it, and every other worker blocks on it for good. So nothing that needs a lock is shared between workers that can die: each worker gets its own private inbox, and no process can end up stuck waiting on one that is gone.

Five: match the parallelism to the job. Processes for computing, threads for waiting, event loops for many calls at once.

Six: keep the database light. It holds only state; the results go to files on each node, written in groups, off the GPU's path. That is why the system keeps scaling as nodes are added.

## 50. The DB is the single source of truth
*7 · Wrap-up · ~0.8 min · no steps*

If you remember one thing from this half of the lecture, make it this. Nowhere in the whole system, in the stage workers, the worker pools, the supervisors, the watchers, the model servers or the nodes, do we keep any state. Every one of them is stateless. The entire state of the run, what is waiting, claimed, done or failed, lives in one place: the DB. It is the single source of truth. Results go to files, and the DB says which ones count.

That one decision is where the distributed-system guarantees come from. Any component can crash and restart at any moment, like the stage worker here, and we survive it, because it held nothing: it simply reads the DB and carries on. Nodes can join or leave at any time, because there is nothing to hand over. And recovery is just a query on the DB, not a procedure someone has to run.

## 51. Where Patram-Ingest sits in the stack
*7 · Wrap-up · ~1.2 min · reveal steps: 2*

To step back: Patram-Ingest, everything after vLLM, is just one part of the infrastructure we have.

**[step 1]** There is a lot supporting it from below: our storage layer, Patram-FS and Patram-DB, the scraper and our synthetic documents that bring raw data in, and DarshinAI for annotation and visualization.

**[step 2]** And above it, Patram-Core takes this data, our training corpus, and makes it possible to train models. Using all of this, we have trained many foundation models, the Patram Suite, and evaluated them on our own benchmarks. These are internal models as of now; we plan to release the Patram series soon, and the sign-up form is on the next slide.

## 52. Thank you
*7 · Wrap-up · ~0.6 min · no steps*

To bring it together: experts built vLLM to run a model as well as the hardware allows, and we built Patram-Ingest around it to keep using it for weeks, on a cluster where nodes die and GPUs come and go. Both are made of ideas you are learning now: scheduling, memory, queues, processes, threads and databases. Thank you. There are two codes on the right: the first is the sign-up form for the Patram series, so we can let you know when it is released, and the second is our hiring form, which is open to students who enjoyed this. Scan whichever is useful. We are happy to take your questions.

**Likely questions.** Why not Kafka or Redis? Every extra component is a new way to fail, and the database costs a small fraction of runtime. What if the DB dies? Results on disk stay safe because saving comes first; with a managed high-availability DB a failover takes about 20 seconds and workers reconnect within a 30-second budget; if the database stays down longer the run aborts and nodes reclaim their rows at next start. Why not per-sample fsync? It is slow on a network filesystem, and the commit group bounds the redo. What about step-level durability? Use DBOS or Temporal for that; our bound is the commit group. Who decides to add nodes? Today a person or a script starts the program on a node; the run then uses it without any other change. A scheduler that decides on its own is the next step.
