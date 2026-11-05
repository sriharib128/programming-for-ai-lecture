# Programming for AI guest lecture: speaker notes

Generated from the deck. Keys: → next · ← back · F fullscreen · O overview · P presenter window · K skip optional slides · T clock · B blackout.

| # | Slide | min | cumulative (core path) |
|---|---|---|---|
| 1 | vLLM and Patram-Ingest | 0.5 | 0.5 |
| 2 | A model, the engine that runs it, and the system around it | 1.5 | 2.0 |
| 3 | Part 1 · Why running a model is hard | 0.2 | 2.2 |
| 4 | A model produces one token at a time | 1.5 | 3.7 |
| 5 | The KV cache stops the repeated work | 1.5 | 5.2 |
| 6 | A request has two phases: prefill and decode | 1.2 | 6.4 |
| 7 | Requests finish at different times | 2 | 8.4 |
| 8 | Reserving for the longest answer wastes memory | 1.2 | 9.6 |
| 9 | Your turn: where have you seen this problem? | 1.5 | 11.1 |
| 10 | vLLM began with that idea | 0.8 | 11.9 |
| 11 | Part 2 · Inside the vLLM engine | 0.2 | 12.1 |
| 12 | The program we will follow | 0.8 | 12.9 |
| 13 | What the constructor builds | 1.5 | 14.4 |
| 14 | At start-up the engine works out how many blocks fit | 1.2 | 15.6 |
| 15 | The engine is one loop with three steps | 1.2 | 16.8 |
| 16 | The scheduler spends a token budget | 1.5 | 18.3 |
| 17 | allocate_slots hands out blocks | 1.5 | 19.8 |
| 18 | Continuous batching on paged memory | 2 | 21.8 |
| 19 | The batch is one long sequence | 1.5 | 23.3 |
| 20 | Part 3 · Five engine features | 0.2 | 23.5 |
| 21 | Chunked prefill splits a long prompt | 1 | 24.5 |
| 22 | Prefix caching reuses shared prompt starts | 1.8 | 26.3 |
| 23 | Guided decoding restricts the next token | 1.5 | 27.8 |
| 24 | Speculative decoding checks a cheap guess | 1.5 | 29.3 |
| 25 | Disaggregated prefill and decode | 0.8 | 30.1 |
| 26 | Part 4 · From one GPU to a service | 0.2 | 30.3 |
| 27 | Three ways to spread a model over GPUs | 1.2 | 31.5 |
| 28 | One process per GPU, and the same engine | 1.2 | 32.7 |
| 29 | Processes, threads and event loops | 1.5 | 34.2 |
| 30 | vLLM uses all three | 1.5 | 35.7 |
| 31 | Two nodes, four engines | 1 | 36.7 |
| 32 | Your turn: which engine gets the next request? | 0.8 | 37.5 |
| 33 | One curl, from start to finish | 1.5 | 39.0 |
| 34 | What to measure | 1.2 | 40.2 |
| 35 | Latency and throughput pull against each other | 1.5 | 41.7 |
| 36 | vLLM has a benchmark tool | 0.6 | 42.3 |
| 37 | What vLLM handles, and what is left to you | 1 | 43.3 |
| 38 | Part 5 · The system around vLLM | 0.2 | 43.5 |
| 39 | What we do: the Patram stack | 0.8 | 44.3 |
| 40 | The scale a foundation model needs | 0.6 | 44.9 |
| 41 | What one training example looks like | 1.2 | 46.1 |
| 42 | Three things that interrupt a weeks-long run | 1.2 | 47.3 |
| 43 | Three requirements for the engine | 0.8 | 48.1 |
| 44 | Part 6 · Keeping the GPUs busy | 0.2 | 48.3 |
| 45 | The model run is one of three steps | 1 | 49.3 |
| 46 | Inside one node | 1.1 | 50.4 |
| 47 | Your turn: which parallelism where? | 0.8 | 51.2 |
| 48 | What we chose for each piece | 1 | 52.2 |
| 49 | Sharing work through one queue | 1.1 | 53.3 |
| 50 | A private inbox per worker | 1.1 | 54.4 |
| 51 | A worker can run any backend | 1 | 55.4 |
| 52 | Part 7 · Crash safe | 0.2 | 55.6 |
| 53 | Nodes take work from one table | 1.6 | 57.2 |
| 54 | Recovery and scaling without intervention | 3.2 | 60.4 |
| 55 | Every error is followed through | 1 | 61.4 |
| 56 | Part 8 · Graphs of stages | 0.2 | 61.6 |
| 57 | One pipeline, a different route for every page | 1.2 | 62.8 |
| 58 | The whole pipeline is a graph | 2 | 64.8 |
| 59 | A dynamic DAG fits our workloads | 0.8 | 65.6 |
| 60 | Stages need a shared record of each page *(deep dive)* | 0.7 | - |
| 61 | The record is one switch per stage *(deep dive)* | 0.8 | - |
| 62 | Two rows per page: Finished and Ready *(deep dive)* | 0.8 | - |
| 63 | Following one page through the graph *(deep dive)* | 2.2 | - |
| 64 | When the sweep lets a stage start *(deep dive)* | 1.1 | - |
| 65 | Ready makes a stage start exactly once *(deep dive)* | 1 | - |
| 66 | A crash between writes never loses a page *(deep dive)* | 1.2 | - |
| 67 | From idea to a running pipeline | 0.8 | 66.4 |
| 68 | All stages at once | 1.2 | 67.6 |
| 69 | What Patram-Ingest supports | 0.6 | 68.2 |
| 70 | Scaling compared with DBOS and Temporal | 1.5 | 69.7 |
| 71 | Key takeaways | 1 | 70.7 |
| 72 | The DB is the single source of truth | 0.8 | 71.5 |
| 73 | Where Patram-Ingest sits in the stack | 1.2 | 72.7 |
| 74 | The same ideas in both systems | 1.5 | 74.2 |
| 75 | Try it yourself | 1 | 75.2 |
| 76 | Thank you | 0.6 | 75.8 |


**Core path ≈ 75.8 min.** The bit-mask deep dive (reached from the button on the dynamic DAG slide) adds the remainder.

## 1. vLLM and Patram-Ingest
*Introduction · ~0.5 min · no steps*

Thank you for having us. We are from the Vision team at BharatGen, where we build foundation models that read documents. Most of our work is not training models. It is the programming around them.

So today is about that programming. We will look at two systems: vLLM, which runs a model, and Patram-Ingest, which we built around vLLM to actually use it.

## 2. A model, the engine that runs it, and the system around it
*Introduction · ~1.5 min · reveal steps: 2*

Here is the plan as one picture. In this course you have used a model: you call it on some tokens, and you get logits back.

**[step 1]** Around the model sits an engine. vLLM is the one we use, built by a large community of experts. It takes many requests from many users and runs them on one model as efficiently as the hardware allows. Parts 1 to 4 open this box.

**[step 2]** Around that sits the system that actually uses the engine. Ours is Patram-Ingest. It decides which prompt to send, tracks every sample, and keeps a run going for weeks on a cluster where machines fail. Parts 5 to 8 are about this box. You are unlikely to rewrite vLLM, but you will very likely write a system like the outer one. Along the way you will see the same programming ideas in both.

## 3. Part 1 · Why running a model is hard
*1 · Why it is hard · ~0.2 min · no steps*

We start from what you already know: a model and a Python loop. Then we see why that loop falls apart as soon as more than one person wants to use it.

## 4. A model produces one token at a time
*1 · Why it is hard · ~1.5 min · no steps*

This is the loop you have probably written or seen. Encode the prompt. Then repeat: run the model on all the tokens, take the logits at the last position only, sample one token, and append it. Stop at an end token or a length limit.

Watch the counters as it plays. Each pass produces one token, and each pass reads one token more than the last. The total grows quadratically with the output length.

Ask the room: what work is being repeated here? The model computes something for each token, and for all the old tokens it computes the same thing again.

## 5. The KV cache stops the repeated work
*1 · Why it is hard · ~1.5 min · reveal steps: 1*

Attention needs a key and a value vector for every earlier token. Those depend only on earlier tokens, so they do not change once computed. On the left, a five-token prompt and six new tokens, with nothing saved. The passes read 5, then 6, up to 10 tokens: 45 in total.

**[step 1]** So we save them. That saved data is the KV cache, for keys and values. Now the first pass computes the five prompt tokens, and every later pass computes only the single new token: 10 in total. Keep the last line in mind. The cache is large, it lives in GPU memory, and it grows while the request runs. Most of the next few slides are about this one piece of memory.

## 6. A request has two phases: prefill and decode
*1 · Why it is hard · ~1.2 min · reveal steps: 1*

The cache splits every request into two phases, and they behave very differently. Prefill is the first pass, over every token in the prompt. It is mostly limited by how fast the GPU can compute. At the end we sample one token, so its length sets the time to first token, which is what a user feels before anything appears.

**[step 1]** Decode is every pass after that: one new token, using the cache. You might expect this to be cheap, but the GPU still has to stream all the model weights out of its memory to compute that one token. So decode is limited by memory bandwidth. The gap between tokens is the inter-token latency. Two phases, two kinds of limit. That difference comes back several times.

## 7. Requests finish at different times
*1 · Why it is hard · ~2 min · reveal steps: 1*

Reading the weights takes about the same time for one token or for many, so we want to batch: run many requests in one pass and share that cost. Here are 8 requests and a GPU with room for 4 at a time. Each column is one pass of the model. The first thing you would write is a fixed batch: take four, run until all are done, take the next four.

Watch the hatched cells. A short request finishes, but its slot stays idle until the longest one in the batch is done, because the batch was decided up front. In this example more than a third of the slots go to nothing.

**[step 1]** The fix is to decide the batch again at every pass. When a request finishes, the next one takes its slot straight away. This is called continuous batching. It came from a system called Orca, published at OSDI 2022, which reported 36.9 times the throughput of NVIDIA FasterTransformer at the same latency on a GPT-3 175B model. Same requests, same hardware, and the run ends much earlier.

But this creates a memory problem. If requests join and leave at every pass, each with a cache that grows, where does the cache go?

## 8. Reserving for the longest answer wastes memory
*1 · Why it is hard · ~1.2 min · reveal steps: 2*

The simple approach is what you would do for a tensor: one contiguous block per request. But we do not know how long an answer will be, so we must reserve room for the longest one it could be. Each request here reserves 16 slots. A has used 5 and B has used 6.

**[step 1]** Request C arrives. It needs 16 slots in one piece, and only 8 remain. So C has to wait, even though most of the memory holds nothing. Memory now limits the batch size, and the batch size limits throughput.

**[step 2]** This is not a small effect. The authors of vLLM profiled the existing systems and found that only about 20 to 38 percent of the cache memory held actual token states. The rest was wasted.

## 9. Your turn: where have you seen this problem?
*1 · Why it is hard · ~1.5 min · reveal steps: 1*

Forget about GPUs for a moment and read these four lines. Many programs share one block of memory, nobody knows in advance how much each needs, each grows bit by bit, and they come and go at any time. Ask the room: you have met this exact problem before. In which course? Take a few answers.

**[step 1]** Operating systems. An OS solves it with virtual memory: split memory into fixed-size pages, and let a program's pages sit anywhere in physical memory, allocated only when needed. The program still sees one continuous range.

The vLLM authors applied that idea to attention, and called it PagedAttention. Requests are the processes, tokens are the bytes, and KV blocks are the pages. A request's blocks can sit anywhere in GPU memory, and a new block is allocated only when the previous one fills. Nothing is reserved in advance, so at most one partly filled block per request is unused. This is why operating systems is worth taking. A decades-old idea unlocked a large gain in a new field.

## 10. vLLM began with that idea
*1 · Why it is hard · ~0.8 min · no steps*

That idea became vLLM. The original paper reported two to four times the throughput of the best systems of the time at the same latency, and the gain was larger for longer sequences and larger models. It started in the Sky Computing Lab at UC Berkeley, and today more than two thousand people have contributed to it, from many dozens of institutions and companies. This is the system built by experts that we mentioned at the start.

For the next three parts we follow an excellent public walkthrough by Aleksa Gordić. We recommend reading it after this lecture. It was written against a specific commit in August 2025, so some class names may have changed by the time you read the code. The structure and ideas are what we want you to take away.

## 11. Part 2 · Inside the vLLM engine
*2 · The vLLM engine · ~0.2 min · no steps*

Now we open the box. We will follow a small Python program through the engine, on one GPU, in one process. No web server yet.

## 12. The program we will follow
*2 · The vLLM engine · ~0.8 min · no steps*

This is the program. Two prompts, some sampling settings, and two calls. It looks like the loop from earlier, but it hides everything we just discussed. For now it runs offline, in one process, on one GPU. Later we add multiple GPUs and a web server, and the core stays the same.

**[step 1]** The first call builds the engine. That is where the model is loaded and the memory is measured.

**[step 2]** The second call adds the requests and runs the engine loop until they are all done. We take these two in turn.

## 13. What the constructor builds
*2 · The vLLM engine · ~1.5 min · reveal steps: 2*

The constructor builds the outer engine. The config holds every setting. The processor validates and tokenizes the input. The output processor turns raw results into what your program sees. In the middle is a client that talks to the engine core. In this example the core is in the same process; later it will be elsewhere, and this client is why nothing else has to change. That is a good design lesson by itself.

**[step 1]** The core has three parts. The model executor drives forward passes on a worker. The structured output manager is for later. The scheduler decides which requests go into the next pass. It has a policy, a waiting queue and a running queue.

**[step 2]** And it has the KV cache manager, the heart of paged attention. It keeps a free_block_queue: a pool of free blocks, often hundreds of thousands of them. If you remember the free list from your allocator lectures, this is one.

## 14. At start-up the engine works out how many blocks fit
*2 · The vLLM engine · ~1.2 min · no steps*

Three things happen at start-up. The worker is assigned a GPU and checks that enough memory is available. The model is built and the weights are loaded. Then comes the interesting part. The engine runs a dummy forward pass, takes a snapshot of how much GPU memory is in use, and divides what remains into KV blocks.

The size of a block comes from a simple formula. The 2 is for the key and the value. A block holds 16 tokens by default. Then the number of heads, the size of each head, and the bytes per number. With example values of 8 heads of size 128 in 16-bit floats, that is 64 kilobytes per layer. So memory is decided once, at start-up, and from then on the engine only hands out blocks. No allocation happens while the model is running.

If asked: the engine also captures CUDA graphs at start-up unless told not to, for faster launches later. That is a detail you can look up in the blog.

## 15. The engine is one loop with three steps
*2 · The vLLM engine · ~1.2 min · reveal steps: 4*

Now generate. It tokenizes each prompt, gives it an ID and an arrival time, and puts it in the waiting queue. Then the whole engine is this: while anything is unfinished, call step. Every call does three things. This is the same loop you wrote earlier, but for many requests at once.

**[step 1]** First, schedule: decide which requests take part in this pass, and make sure they have memory. This is the next two slides.

**[step 2]** Second, run the model and sample one token per request. In your loop this was the only line that mattered.

**[step 3]** Third, postprocess: append the tokens, turn them into text, and check whether each request is finished. A finished request gives back its blocks immediately, which is what makes room for the next one.

**[step 4]** These are the four ways a request can stop. Because the schedule is decided at every pass, a new request can join on the next one. Continuous batching is not a separate component; it follows from this loop.

## 16. The scheduler spends a token budget
*2 · The vLLM engine · ~1.5 min · reveal steps: 3*

Each pass has a budget: the maximum number of tokens it may process. Three requests are running, and three are waiting. How would you spend the budget?

**[step 1]** vLLM serves decode first. Requests already running each take one token. A user already reading an answer should not see it stall because someone else arrived.

**[step 2]** Then it turns to the waiting queue. D has 40 tokens in its prompt. It gets its blocks, and moves to running.

**[step 3]** Now E. There are 21 tokens left in the budget and E needs 30. It takes 21 and finishes its prompt on a later pass. F keeps waiting. The older V0 engine could only run prefill or decode in one pass; the V1 engine mixes them. The next slide looks at how a request gets its blocks.

## 17. allocate_slots hands out blocks
*2 · The vLLM engine · ~1.5 min · reveal steps: 4*

Here is the function at the centre of the memory design, allocate_slots. Request A has 17 new tokens.

**[step 1]** Blocks hold 16 tokens each, so it needs the ceiling of 17 over 16: 2 blocks. One slot-level detail: the last block is only partly full, and that is the only waste there is.

**[step 2]** It takes the first two blocks from the free queue and records them in req_to_blocks, a dictionary from request ID to its list of blocks. The queue is a doubly linked list, so both operations are constant time. When a request finishes, its blocks go back on the queue.

**[step 3]** Now time passes and the queue is nearly empty. Request B needs three blocks, and two are free. Ask the room: what should happen? There is more than one reasonable answer.

**[step 4]** It depends on the request. A request that has not started just stays in the waiting queue. A running request that needs one more block is a harder case: the engine can preempt a lower-priority request, free its blocks, and later compute it again from scratch. That is called recompute preemption. The older V0 engine could also swap a cache out; the V1 engine recomputes. Think about what that costs: the prefill has to be repeated.

## 18. Continuous batching on paged memory
*2 · The vLLM engine · ~2 min · no steps*

Here are the last few slides running together. On the left are five requests. On the right is GPU memory divided into blocks, and each dot is one token's keys and values. Each tick of the player is one call to step.

A, B and C arrive at the start and each get the blocks they need for their prompts. As they decode, each takes one more dot per pass, and takes a new block when one fills. Watch the colours mix: a request's blocks are not next to each other, and that does not matter.

When C finishes, its blocks go back to the free queue immediately. D and E arrive while others are running, and they join on the next pass. No request ever waited for a batch to end, and no memory was reserved for tokens that do not exist yet. Pause here and ask if anyone has questions, because everything in Part 3 builds on this picture.

## 19. The batch is one long sequence
*2 · The vLLM engine · ~1.5 min · reveal steps: 2*

One more piece, and this one is about tensors. A is prefilling five tokens. B and C are decoding, so they each contribute a single token. In ordinary PyTorch you would make a rectangle, and pad. Here more than half the cells are padding, and in a real batch, with long prompts, far more.

**[step 1]** vLLM does not make a rectangle. It concatenates everything into one long sequence: seven tokens, no padding. A positions array records where each token sits in its own request, which is why B's token says 9. Attention masks ensure each token attends only to its own request's tokens. This is why requests can join and leave at every pass: nothing about the shape of the tensor depends on who is in the batch. Custom attention kernels make this efficient.

**[step 2]** The last piece connects to paging. Every token has to write its keys and values somewhere, and slot_mapping is the address. Take B: position 9, blocks of size 4, so it is in the third block, block number 9, offset 1, which is slot 37. This is exactly virtual-to-physical address translation, computed for every token in the batch. That is the core of vLLM. Next, what it builds on top of this.

## 20. Part 3 · Five engine features
*3 · Engine features · ~0.2 min · no steps*

With the core in place, five features. For each one we ask the same two questions: what problem does it solve, and how little does it have to add to the loop you just saw?

## 21. Chunked prefill splits a long prompt
*3 · Engine features · ~1 min · reveal steps: 2*

Problem: one very long prompt takes over an entire pass. Everyone else waits for it, and their time to first token gets worse.

**[step 1]** Fix: split the prompt across several passes, and let others share each one. P takes three passes now, so its own first token comes a little later, and everyone else's comes earlier. You choose who waits. This is the same thing an operating system does with a time slice.

**[step 2]** Look at how small the change is. If the new tokens exceed a threshold, cap them. The block indexing we already built takes care of the rest. In vLLM you enable it by setting long_prefill_token_threshold to a positive number. A good core design makes features small.

## 22. Prefix caching reuses shared prompt starts
*3 · Engine features · ~1.8 min · reveal steps: 3*

Problem: many prompts begin the same way. Think of a system prompt, or the same instructions sent with every page. Without a cache, every request recomputes that prefix. Here two requests share three blocks of tokens.

**[step 1]** How do we know two prefixes match? vLLM hashes each complete block. The trick is that each hash also includes the previous block's hash. So a match on h2 tells you h0 and h1 matched as well: the whole prefix is equal. If you have seen git or a blockchain, it is the same chain. Metadata such as a LoRA ID or a cache salt also goes in, so requests that should not share do not.

**[step 2]** The first request finds no hashes, so it computes the three blocks and records which block holds each hash.

**[step 3]** The second request finds all three, reuses those blocks, and only computes what follows. Here is a nice detail: when a request finishes, its blocks go back to the free queue, but the hash entries remain. A block is only truly forgotten when the free queue hands it to someone else. So the free list is also a least-recently-used cache, at no extra cost. Keep this in mind for the second half, where every request in a step shares the same instructions.

## 23. Guided decoding restricts the next token
*3 · Engine features · ~1.5 min · no steps*

Problem: you need the output to follow a format. A label from a fixed list, or valid JSON. You could ask nicely in the prompt and hope. Guided decoding makes it impossible to break the format. Here is the simplest case: the answer must be Positive or Negative. Imagine each character is a token, and our vocabulary has eight tokens.

A grammar is compiled into a finite state machine. At the start, only P or N are allowed. So a bit mask is built, with a 1 for each allowed token, and every disallowed logit is set to minus infinity. Whatever the model wants to say, it can only sample P or N.

**[step 1]** It samples P. The state machine moves, and now only o is allowed. The mask changes.

**[step 2]** Then s, and so on until the word is complete. This works for regular expressions and context-free grammars, so most programming languages and JSON. In vLLM the masks are arrays of 32-bit integers, and libraries such as xgrammar produce them. Remember this: one integer holding one yes or no per item. We use the same idea in Patram-Ingest for a completely different job.

## 24. Speculative decoding checks a cheap guess
*3 · Engine features · ~1.5 min · reveal steps: 3*

Problem: every token needs a full pass of a large model, reading all its weights. Three tokens cost three passes.

**[step 1]** Idea: let something cheap guess several tokens ahead. Here it proposes three: the, cat, ran.

**[step 2]** Then the large model runs once over the context and all the guessed tokens together, and now we have its probability at each position. Go left to right. If the large model likes a token at least as much as the draft did, accept it. If not, accept it with probability equal to the ratio. Here "the" is accepted. "cat" is a coin flip at 0.6, and happens to pass. "ran" has only a 0.2 chance, and is rejected, so we stop there.

**[step 3]** At the rejected position we sample a replacement from a corrected distribution: large minus draft, floored at zero, then normalized. If all were accepted, we get one more for free. So one large pass gave three tokens. The accept rule is chosen so the result has exactly the distribution of the large model on its own. This is one of those results worth reading the proof of. vLLM V1 does not use a small LLM as the draft; it uses cheaper methods: n-gram lookup in the existing text, EAGLE and Medusa.

## 25. Disaggregated prefill and decode
*3 · Engine features · ~0.8 min · reveal steps: 2*

Remember the two phases. Prefill is limited by compute and comes in bursts. Decode is limited by memory bandwidth and is steady, and users notice any stall. Running both on one GPU means a burst of prefill can disturb decode.

**[step 1]** So run them apart. N instances only do prefill and write the KV cache to a shared service. M instances read it and do the decoding. A piece of code called a connector moves the data. That interface is still changing, so treat this as the idea rather than a stable API.

**[step 2]** It costs extra machinery, and pays off when you are serving at large scale. A one-sentence takeaway from these five features: chunked prefill and prefix caching change how prefill runs, guided and speculative decoding change how decode runs, and this one separates the two. All five sit on the loop from Part 2.

## 26. Part 4 · From one GPU to a service
*4 · Serving at scale · ~0.2 min · no steps*

So far: one process, one GPU, no network. Now we scale up to several GPUs, scale out to several machines, and put a web server in front. Watch how much of the engine has to change. The answer is almost none of it.

## 27. Three ways to spread a model over GPUs
*4 · Serving at scale · ~1.2 min · no steps*

There are three ways to use more than one GPU, each answering a different problem. Tensor parallelism: the model does not fit on one GPU, so each GPU holds a slice of every layer, inside one node. Pipeline parallelism: it does not even fit on one node, so the layers themselves are split across nodes. Bandwidth inside a node is far higher than between nodes, which is why tensor parallelism is usually tried first. Data parallelism: the model fits, but you need more throughput, so you run whole copies and spread the requests.

A warning about words. Pipeline parallelism here means splitting a model's layers. Later, in Patram-Ingest, you will hear pipeline parallel used for something else: different models in a workflow all running at the same time. Same words, different ideas. The field reuses words.

## 28. One process per GPU, and the same engine
*4 · Serving at scale · ~1.2 min · reveal steps: 3*

Say tensor parallelism across 8 GPUs. Each GPU gets its own process. The class MultiProcExecutor starts them, and each goes through the same init device and load model steps we saw before. At start-up they hand back their response queue handles, and then each sits in a loop, blocked waiting for work.

**[step 1]** The engine calls execute_model, as always. The executor puts the work on one broadcast queue in shared memory. It is implemented with shared memory, so all the workers on the node can read the same message.

**[step 2]** All 8 wake up and run their slice, exchanging tensors between themselves.

**[step 3]** The engine waits on the queue of the one worker that holds the final output. And here is the point: the scheduler, the blocks and the loop did not change at all. Only the object behind execute_model changed. That is an interface doing its job, and it is why we said the client and executor design was a lesson in itself.

## 29. Processes, threads and event loops
*4 · From one GPU to a service · ~1.5 min · no steps*

vLLM is now many pieces running at the same time, and this is the part of the lecture that is most directly about programming. Before we look at how vLLM arranges those pieces, the first principles. There are three ways to have a computer do many things at once, and each is good at one thing. We will use these three again for Patram-Ingest.

A process is a separate program with its own memory and its own Python interpreter. Processes really run in parallel, even Python code, and if one crashes the others keep going. The cost: they are heavier, and data has to be copied between them. So processes are for CPU-heavy work, for anything that might crash, and for anything that owns a GPU.

Threads are helpers inside one program. They are the easy option, because they share memory: handing a result to another thread is just passing an object, nothing is copied. The catch in Python is the GIL: only one thread runs Python at a time. That is fine while a thread is waiting on the disk, the network or the database, because waiting releases the GIL, but it is bad for CPU work. And a crash takes the whole program down. So threads are for waiting.

An event loop is one thread that juggles many waits. Each call starts, waits for its answer, and while it waits the loop runs the others. Hundreds of calls can be in flight almost for free, and there are no locks because only one thing runs at a time. But one slow step that does not wait properly blocks every call. So event loops are for many model calls at once.

Rule of thumb, under each column: computing, a process; waiting, a thread; many waits at once, an event loop.

## 30. vLLM uses all three
*4 · Serving at scale · ~1.5 min · reveal steps: 2*

Here is how vLLM uses those three tools. Start on the left: the API server. Each client request is a task on one asyncio event loop, because a request spends almost all of its time waiting for tokens. Remember: asyncio is concurrent, not parallel. One thread can hold hundreds of open requests.

**[step 1]** In the middle, the engine core process. The main thread runs the loop you already know. If it had to read and write network sockets it could stall, and a stalled loop is an idle GPU. So there are two more threads. The input thread blocks on the socket, and when something arrives it puts it on a queue. The output thread does the reverse. These threads spend their lives waiting, which is exactly what threads are good at in Python. Two plain queues join them to the main thread.

**[step 2]** On the right, one process per GPU. Heavy computation, full parallelism, and one owner per GPU. So: event loop for many waits, threads for waiting, processes for computing. These are the choices you would make from the rule of thumb on the last slide. Keep this picture in mind; in Part 6 you get to make these choices yourself.

## 31. Two nodes, four engines
*4 · Serving at scale · ~1 min · no steps*

Here is a concrete deployment. Two nodes with eight GPUs each, a model that needs tensor parallelism of 4, and four replicas. So TP 4 and DP 4, with two engines on each node. Each small group is one engine core process with its four GPU worker processes under it.

You start this with the same command on both machines. On the first node, add headless, so no API server runs there. On the second node, change the start rank to 2 and drop headless. The API server and a small DP coordinator run on that second node. The processes do a handshake over the network, then settle into the steady state we just drew.

## 32. Your turn: which engine gets the next request?
*4 · Serving at scale · ~0.8 min · reveal steps: 1*

With four engines, someone must choose one for each new request. The rule is one line. Here are four engines. Ask the room: which gets the next request? Give them a moment to do the sum. Some will pick engine 3 because it has the fewest running.

**[step 1]** Engine 2 wins with 13, ahead of engine 3 at 14, even though engine 3 has fewer running. A waiting request means that engine is out of room, so it is penalized heavily. This simple formula does useful work. Notice how much of a real distributed system comes down to a one-line heuristic. The DP coordinator process periodically sends the queue lengths to the API server.

## 33. One curl, from start to finish
*4 · Serving at scale · ~1.5 min · no steps*

Now all of it together, following one request. Press next to step through it. You send one curl command from your terminal.

**[step 1]** It reaches FastAPI, served by Uvicorn, which handles the route on the event loop.

**[step 2]** The prompt is tokenized and packed with sampling settings and a request ID. Then AsyncLLM takes over, on the same path as the offline engine.

**[step 3]** Load balancing: the score from the last slide picks an engine, and the request is sent to that engine's socket.

**[step 4]** The engine's input thread wakes up, decodes the message and puts it on the input queue.

**[step 5]** The main thread picks it up and calls step repeatedly. Schedule, forward pass and postprocess: everything from Part 2, possibly with worker processes on many GPUs below it.

**[step 6]** The output thread sends results back through its socket.

**[step 7]** Two asyncio tasks in the API server receive them, and FastAPI returns the response to your terminal, with the finish reason and usage. A whole distributed machine, behind one curl. Any questions on this picture before we discuss how to measure it?

## 34. What to measure
*4 · Serving at scale · ~1.2 min · no steps*

So far we have looked inside. How do you judge the whole system? From the outside, one request looks like this line. Time to first token is the wait for the first dot. It is mostly prefill and queueing. Inter-token latency is the gap between dots, and time per output token is its average. End-to-end is the whole thing.

Those are latencies, about one request. Throughput is about the system: tokens or requests per second. The last one is the most honest: goodput counts throughput only for requests that met your targets. A system that does a lot of work with every user timing out has high throughput and zero goodput. When you report numbers for a project, say which of these you measured.

## 35. Latency and throughput pull against each other
*4 · Serving at scale · ~1.5 min · reveal steps: 1*

Why do these compete? Look at one decode step as the batch size grows. Drag the slider or let it play. On the left, time per step. At small batches it is nearly flat, because most of the time is streaming weights from memory, and computing one token or ten takes about the same. Past a saturation point the GPU runs out of compute, and step time grows with the batch. On the right, throughput climbs while batching is free, and then flattens: the roof of what is called a roofline model.

**[step 1]** So what you choose depends on the job. A chatbot sits on the left, where tokens come quickly. Offline batch work does not care about any one request, only about the total. This is exactly the setting the blog names for high throughput: synthetic data generation and offline processing. That is our job, and it is what the second half is about.

## 36. vLLM has a benchmark tool
*4 · Serving at scale · ~0.6 min · no steps*

You can measure all of this yourself, today, with no extra tools. The latency command uses a short input and small batch. The throughput command sends a fixed set of prompts at once. The serve command launches a server and simulates real traffic, with random gaps between requests. There is also an auto-tune script that searches for settings that meet a target you give it. A good exercise: run these on a small model and change one setting at a time.

## 37. What vLLM handles, and what is left to you
*4 · Serving at scale · ~1 min · reveal steps: 1*

Let us stop and take stock. That was the system experts built. It handles scheduling, memory, batching, multiple GPUs and serving, and you get all of it from one command. We could not have built this ourselves, and we did not need to.

**[step 1]** But look at what happens when you actually have a job to do. In our case, generate training data from a hundred million pages. vLLM does not know that. It sees one request at a time. Which prompt comes next, whether an answer is usable, what happens to a page when a node dies, which model a page should go to next: none of that belongs in an inference engine, and rightly so. That is a second program, and you have to write it. This is the part you are most likely to do yourself in your career. It is also where the second half begins.

## 38. Part 5 · The system around vLLM
*5 · The system around vLLM · ~0.2 min · no steps*

The rest of the lecture is about one real system built around vLLM. It comes from our own work: first what we do, then why it needs more than a fast model server, and then the design, in three parts.

## 39. What we do: the Patram stack
*5 · The system around vLLM · ~0.8 min · no steps*

What we do: the Vision team at BharatGen builds sovereign vision foundation models for Indian documents. The model reads the page image directly, so layout, tables and stamps are not lost on the way.

This is our stack as a pyramid, read from the bottom up. At the base is storage: our own file system and database. On it, we collect raw data, scraped and synthetic documents, and beside that sits our annotation and visualization tool, DarshinAI. Above that is training data generation: that is Patram-Ingest, what the rest of this lecture is about, which turns raw pages into training data. Then the training infrastructure. Then the models, the Patram Suite, shown on the right: multi-task foundation models, the Patram series, the current one covering 34 tasks and the next adding more than 22 Indian languages; task-specific models for grounding, layout and grounded reasoning; and agents such as PatramParse. At the top, evaluation measures all of it. Everything above the ETL layer is trained or measured on data Patram-Ingest produced.

## 40. The scale a foundation model needs
*5 · The system around vLLM · ~0.6 min · no steps*

This is the scale a foundation model needs, and the scale we work at: more than 100 terabytes of image data, more than 100 million training examples, more than 100 billion tokens of model output, generated on more than 500 GPUs. For Patram 1.5 alone it was more than 50 million examples and 41 billion tokens, and every release needs more.

At that size, generating the data is not a script you run overnight. It is a workflow that has to keep going, without interruption, for weeks. Hold on to that phrase, because the rest of the lecture is about what gets in its way.

## 41. What one training example looks like
*5 · The system around vLLM · ~1.2 min · no steps*

Before the problems, what does a model actually learn from? Examples, millions of them. Here is one. The input is the image of a page, here an electricity bill. The example pairs it with a question, "What is the payment due date?", the answer, "15 July 2015", and where on the page the answer is: the orange box. A model that sees millions of these learns to read documents and to point at its evidence.

Who writes these? Not people: there are far too many. They are made automatically, in a chain. One model understands what the page is. Another writes a question. Another answers it from the page. And a last one verifies the answer against the page. Each call needs the output of the one before.

The same page also teaches other things: reading all its text, finding the tables, turning a table into rows. Now multiply by a hundred million pages, in more than 22 languages. That is the workload the rest of this lecture is about.

## 42. Three things that interrupt a weeks-long run
*5 · The system around vLLM · ~1.2 min · no steps*

We just said a run must keep going for weeks. On a real cluster, three things get in the way, and the engine has to handle all three by itself.

One: nodes die and restart. Over weeks, nodes crash, reboot, run out of memory or are taken back. The run has to recover on its own: notice what died, restart it, and carry on, without a person watching.

Two: GPUs are lent out. The cluster is shared, so we sometimes lend GPUs to another team for a while. The run should carry on with fewer, and when the GPUs come back it should scale up and use them again on its own, without a restart.

Three: complex workloads need pipeline parallelism. A page goes through several model steps, and we want every step running at the same time, with steps spread over different nodes.

If asked whether this really happens: in one run, nine of 24 nodes stopped working, and nobody noticed for six hours, because nothing was in place to notice.

## 43. Three requirements for the engine
*5 · The system around vLLM · ~0.8 min · no steps*

From those problems come three needs, and we take them in order.

First, busy GPUs. The GPUs are the expensive part of the cluster, and Part 6 is about never letting them wait for anything: not the host, not the disk, not another step.

Second, crash safety. Nodes die and GPUs come and go, and when the dust settles the output must still hold every record exactly once, without a person cleaning up. That is Part 7. Normally this need is expensive, because engines that survive crashes write every step to a database; Part 7 shows how we avoid that.

Third, any workflow with very little code. Once someone can picture a pipeline, with steps that branch and merge on what the data contains, getting it running across every node should take a few lines of code and one command. Coordination, retries and scaling should come for free. That is Part 8.

First, busy GPUs.

## 44. Part 6 · Keeping the GPUs busy
*6 · Keeping the GPUs busy · ~0.2 min · no steps*

We have the problem and the three needs. We take the first one first: how to keep the GPUs busy. This is the part where we build up from first principles: what a GPU is waiting for, and how a program should wait.

## 45. The model run is one of three steps
*6 · Keeping the GPUs busy · ~1 min · reveal steps: 1*

Start with what the GPU actually does. For every batch of pages, the model run is one step. Before it, the host has to build prompts and read and check images. After it, the host has to parse and validate the answers, write them to disk and record that they are done. The GPU does only the middle part.

**[step 1]** Two ways to run the same four batches, on one clock. Press play, or drag the slider. Top: one batch at a time. The host prepares, then the GPU runs, then the host finishes, and the GPU sits idle while the host works. Bottom: overlapped. The host prepares the next batch and finishes the last one while the GPU runs this one. The same host work is still done, but none of it is on the GPU's critical path, so the whole run ends sooner and the GPU lane is continuous. So the question is not how to make the host faster; it is how to make sure the host is always one batch ahead. That means many pieces of host code running at the same time as the GPU. Next: what those pieces are.

## 46. Inside one node
*6 · Keeping the GPUs busy · ~1.1 min · no steps*

Here is what runs on every node, before we talk about how. Every node runs the same program; there is no master node.

On the left, the orchestrator process. It has four jobs. Prepare claims samples and builds the model requests. Collect gathers the results as they come back. Write saves them to disk and then marks them done. Upload moves finished files to the object store.

In the middle, the worker pool: the worker processes that run the models. A dispatcher hands each request to a worker. There is one worker per model server, GPU, browser or CPU slot, and each worker calls a backend. A supervisor restarts any worker that dies.

On the right, the backends a worker can call: vLLM servers, Hugging Face models, a CPU process such as page rendering, or any classic model such as SAM3 or YOLO. And around everything, a small watcher restarts the whole program if it exits or the node reboots.

All of these pieces must run at the same time, or the GPU waits, as we just saw. So for each one we have to choose the right kind of parallelism, and you have already seen the three options, in vLLM.

## 47. Your turn: which parallelism where?
*6 · Keeping the GPUs busy · ~0.8 min · no steps*

You met the three options in Part 4: process for computing, thread for waiting, event loop for many waits. Here is the node again. Every one of these boxes has to run at the same time. Over to you: which ones would you make processes, which threads, and which an event loop? A hint: ask of each box whether it computes, whether it mostly waits, or whether it juggles many calls at once. Take a few answers from the room before moving on.

## 48. What we chose for each piece
*6 · Keeping the GPUs busy · ~1 min · no steps*

Here is what we chose: the same picture, coloured by kind.

Processes, in blue: the orchestrator, the worker pool, and each worker. These do CPU work in Python, such as checking images and handling JSON, so they need their own interpreter. A crash, for example an out-of-memory kill, takes down one process and nothing else. And a GPU is owned by exactly one process. We learned this the hard way: early versions ran the model in the same process as the rest of the pipeline, and the shared interpreter lock was the first bottleneck.

Threads, in purple: inside the orchestrator, prepare, collect, write and upload are threads, and in the pool so are the dispatcher and the supervisor. They spend their time waiting on the database, on fsync or on the network, and waiting releases the lock, so threads overlap well. Handing a result from one to the next is just passing an object.

Event loops, in orange: inside each worker, one asyncio loop keeps many calls in flight, for example 24 requests per vLLM server, each handled as its answer arrives. One thread, no lock, many waits.

## 49. Sharing work through one queue
*6 · Keeping the GPUs busy · ~1.1 min · reveal steps: 1*

We now have several workers, and requests to hand out. How do we balance the load between them? The easiest way is one shared queue: put every request in it, and let each worker pull the next one when it is free. A fast worker simply pulls more often, so the load balances itself.

Look at what a pull does inside. The worker takes the queue's lock, pulls one request, and releases the lock. Only one worker holds the lock at any moment; you can see it passing between them.

**[step 1]** Now a worker is killed, for example by an out-of-memory kill, at the moment it holds the lock. A killed process runs no cleanup, so the lock is never released. Every other worker is now waiting for a lock that nobody will ever give back. The supervisor restarts the dead worker, and the new one waits on the same lock. So the pool reports itself healthy, with every worker alive, but throughput is zero. There is no error and no timeout; the run just stops. This happened to us: in a test that killed one of two workers mid-request, the pool hung in three of eight trials.

## 50. A private inbox per worker
*6 · Keeping the GPUs busy · ~1.1 min · reveal steps: 2*

The fix is not a safer lock. Holding a lock when you are killed is how the primitive works. The fix is to take the shared lock away from anything that can be killed. One dispatcher, a thread in the pool, is the only reader of the shared queue. It hands each request to a free worker by putting it in that worker's own inbox. Each worker reads only its own inbox.

**[step 1]** Now kill a worker. The worst it can do is block its own inbox, and that inbox is thrown away with it. The dispatcher sees the worker is gone and stops sending to it. The other workers never shared anything with it, so they keep working.

**[step 2]** The supervisor starts a new worker with a fresh, empty inbox, and the requests the dead worker owed come back as system errors and are sent again. The rule we took from this: never share a lock with a process that can die. Since the change, the same kill test has not hung once, and with one of four workers killed all 40 test images were committed. One limit we state honestly: results still travel back on shared queues, so the same kind of failure is possible there, in a much narrower window.

## 51. A worker can run any backend
*6 · Keeping the GPUs busy · ~1 min · no steps*

So what actually runs inside one of those worker processes? Anything that fits three functions: initialise, call and terminate. The pool, the inboxes, the supervisor and the error handling are the same whatever the backend is.

Most of our work calls hosted vLLM servers over HTTP: shared servers that many pipelines use, so an ingestion node needs no GPU of its own. A worker can also load a Hugging Face model on the node's own GPU, do CPU work such as rendering pages in a headless browser, or run vision models such as SAM3 and YOLO.

vLLM itself got here in steps. We started with batch generate inside the pipeline process, moved to vLLM's async engine for continuous batching, then found its outputs differed from vllm serve with the same arguments, so we now drive vllm serve over HTTP, and finally shared hosted servers. The lesson from that path: run the model the way vLLM itself serves it.

## 52. Part 7 · Crash safe
*7 · Crash safe · ~0.2 min · no steps*

Busy GPUs are only useful if the work survives. Part 7 is how the engine stays crash safe: it loses nothing and repeats nothing, even when processes and machines die.

## 53. Nodes take work from one table
*7 · Crash safe · ~1.6 min · no steps*

Busy GPUs are only useful if the work survives, so start with how many nodes share one run, with as little overhead as possible. Nodes do not talk to each other and there is no coordinator. Each step's queue is a table in the DB with one row per sample, drawn here as one box per image, and each row has a state: waiting, claimed, done or failed. A node that wants work sends the database one command that picks a few waiting rows, marks them as its own and writes its name on them, all in one step. A second node making the same request at the same instant skips those rows, so two nodes can never get the same image. Nothing is assigned in advance, so a fast node simply takes more work. Click the steps, or press next, to walk through one run.

**[step 1]** Nodes A and B each ask the queue for a batch of images. Each batch takes its node's colour, and the node works on it.

**[step 2]** Now node B crashes in the middle of its batch. Its images are marked as claimed by a node that no longer exists. Recovery hands them back to waiting, so nothing is lost.

**[step 3]** Node C arrives and claims exactly those images, and the run carries on as if nothing happened.

**[step 4]** Node D joins later. One image that cannot be read is marked failed without stopping the rest, and the table finishes with every image done once. To grow a run you start the same program on more nodes; to shrink it you stop some. The DB is deliberately one plain database on one machine, because every extra component is another way to fail.

## 54. Recovery and scaling without intervention
*7 · Crash safe · ~3.2 min · reveal steps: 8*

Back to the first two problems from the start: nodes die, and GPUs come and go. The run handles both without anyone stepping in: it recovers, and it scales. First, recovery.

**[step 1]** The idea is simple: each layer is restarted by the layer around it. Click any of the three cases on the right to play it. Inside one node, workers live inside a supervisor, the supervisor lives inside the program, and a small watcher script sits around the program. The vLLM server has its own watcher too.

**[step 2]** A worker dies. The supervisor notices and starts a new one in its place, and the requests that worker had are sent again.

**[step 3]** The whole program stops, or the node reboots. The watcher starts the program again. Whatever samples it had claimed and not finished go back to the table, and any node can pick them up.

**[step 4]** A vLLM server crashes. Its own watcher restarts it, and the requests that were waiting on it go back to the queue. In every case nobody is paged and no work is lost.

**[step 5]** Now scaling, in three steps. Step one: all the servers are up. The key decision: pipelines don't own models. The cluster runs model servers on every machine, and the pipeline just uses whichever are serving. We even launch the run before any server is up: it just waits. Every 30 seconds the run checks which servers are serving, and starts one worker per serving server. No restart, no configuration. Every worker fetches samples from the database and sends them to its server.

**[step 6]** Step two: a colleague borrows servers 3 and 4. Their workers do not die: they drain, sending the samples they had not finished back to the database, and then they wait. Everyone else carries on.

**[step 7]** Step three: the servers come back, and those workers start again and fetch from the database. Nothing was lost and nobody restarted anything. You can click the steps, pause, or drag the slider.

**[step 8]** Here is what that looks like over one day, as in our blog; the shape is illustrative. One: we launched before the models were up, and work started as each server came online. Two: a colleague borrowed GPUs; the workers using them drained and waited. Three: the test finished, and those workers fetched from the database again. Four: a server crashed; its requests went back and it restarted. Five: free GPUs appeared and the run spread onto them. Nobody touched the run all day.

## 55. Every error is followed through
*7 · Crash safe · ~1 min · no steps*

At production scale, something fails every minute, and every error has to be followed through to the end: no error is dropped, and none is left vague. To do that, every error is sorted, where it happens, into one of two kinds.

In the first kind, the sample itself is the problem: a corrupt image, an image too large for the model, a file that cannot be read, an answer that still does not parse after a retry with a stricter prompt. Retrying again would only waste time. So we discard it: mark it failed and record the reason.

In the second kind, the system or the infrastructure is at fault: a server crashed, a process ran out of memory or was killed, the network dropped, a server was put to sleep. The sample is fine, so it must never be marked failed. It is retried, on another node or at a later time. And if everything is failing at once, the run pauses instead of failing samples.

When it is unclear, treat it as the system's fault, because the two mistakes do not cost the same: a retry costs seconds, but a good sample thrown away is lost for good. The result is a dataset where every missing sample has a recorded reason, and none are missing because of an outage.

*If asked: a fuse stops the whole run, failing nothing, after max(2b, 64) consecutive infrastructure failures with no success; and a request that fails as infrastructure more than five times while others succeed is failed as itself. Before this classification existed, a dead backend marched whole datasets into the failed state.*

## 56. Part 8 · Graphs of stages
*8 · Graphs of stages · ~0.2 min · no steps*

Until now we treated a stage on its own. But a good training example is never the work of one model. Part 8 is how a page moves through many models, each page on its own path, and how the engine runs that across machines without a coordinator.

## 57. One pipeline, a different route for every page
*8 · Graphs of stages · ~1.2 min · no steps*

Here is the problem Part 8 solves. A good training example is never the output of a single model. Six pages enter the same pipeline of seventeen agents. Understand reads each page and decides where it goes next, and later agents keep deciding too.

A chart is read, then re-read by a second model to catch wrong numbers. A table is rebuilt as HTML and rendered in a browser to check it matches. A form has one field hidden, so the questions test whether the model notices it is missing. A text page goes through key-fact extraction, and if Verify rejects the answer a larger teacher model writes the final one. A scan is straightened first, then handled like any text page. A blank page is dropped straight away, so no expensive stage runs on it.

All six run together, each on its own route. You can click any page to replay just its route; the line at the bottom shows the route it took, which every output records.

## 58. The whole pipeline is a graph
*8 · Graphs of stages · ~2 min · reveal steps: 4*

Put all those routes together and you get one graph. A page enters at the left. Each box is a model, a tool or a check. Three rules decide where a page goes and when a box may start, and we will zoom into each.

**[step 1]** One: routing. After Understand finishes a page, a small function written by the pipeline author looks at what it found and picks the next box for that page. A chart goes to the chart reader, a table to the table reader, a formula to the LaTeX writer. A text page goes to two boxes at once, transcription and layout. It can also pick none: a blank page simply stops.

**[step 2]** Two: needs both. Some boxes need several inputs. Grounded question answering needs both the transcribed text and the layout of the same page. Watch the label: the text arrives first, so it keeps waiting for the layout. When the layout arrives, it starts, exactly once. It does not matter which finished first or on which machine. Solid lines mean every input is needed.

**[step 3]** Three: either one is enough. Write a question takes a table or a chart. A page is never both, so the table reader's input will never come for a chart page; waiting for both would wait forever. So it starts as soon as one input is done. Dotted lines mean one input is enough.

**[step 4]** Three rules: route the page, needs every input, one input is enough. Every pipeline we run is built from these.

## 59. A dynamic DAG fits our workloads
*8 · Graphs of stages · ~0.8 min · reveal steps: 1*

Look at the pipelines we build. Every one of them has three things. It is a graph, declared once in code: each stage names its inputs, and the engine works out who feeds whom. Acyclic: no loops. Verification loops are common, but a cycle makes it impossible to say when a sample is finished, so a retry is a bounded decision inside a routing function, with a counter so it cannot go on forever. And dynamic: the graph is fixed, but each sample's route through it is decided while it runs, from what earlier stages found.

**[step 1]** Put the three together and you get the conclusion: a dynamic directed acyclic graph fits almost every workload we have. Straight chains, branches by content, merges and early exits are all special cases of that one shape, so the engine only has to run one thing well. If the room wants to know how the engine tracks each page through such a graph, the Deep dive button opens seven slides on that; otherwise carry on.

## 60. Stages need a shared record of each page (deep dive)
*8 · Graphs of stages · ~0.7 min · reveal steps: 2*

We now go one level deeper: how does the engine actually run a graph like the one we just saw, on many machines? Here is the difficulty. Every stage is its own process, often on a different machine, and they share no memory.

**[step 1]** They also never send messages to each other. That is deliberate, it is the same rule as before: no coordinator process that can crash and take the run with it. But it means that when Text finishes a page on machine 3, nobody tells Grounded Q&A.

**[step 2]** So the engine keeps one small record for every page that is in flight, in the DB. Every stage reads it and writes to it. All the coordination between stages happens through this record. The next slides show what is in it. It is only two numbers.

## 61. The record is one switch per stage (deep dive)
*8 · Graphs of stages · ~0.8 min · reveal steps: 2*

Every stage in a graph gets a position, like a seat number: Understand is seat 0, Text is seat 1, Layout seat 2, Grounded Q&A seat 3. For each page, the record has one switch per seat. A switch is a bit: it is either 0 or 1, off or on. At the start they are all off.

**[step 1]** A switch that is on means yes for that stage. This row says: yes for Understand, yes for Text, no for Layout, no for Grounded Q&A. We will say what the question is on the next slide.

**[step 2]** The useful trick is that a row of switches can be stored as one ordinary number. Give each seat a value: seat 0 is worth 1, seat 1 is worth 2, seat 2 is worth 4, seat 3 is worth 8. Add up the switches that are on, 1 plus 2, and this row is the number 3. That is all a bit mask is: a row of switches kept as a single integer. It is tiny, it is cheap for the DB to store, and the DB can update one switch without touching the others.

## 62. Two rows per page: Finished and Ready (deep dive)
*8 · Graphs of stages · ~0.8 min · reveal steps: 2*

Each page gets two such rows, so two numbers. The first is Finished: which stages have finished this page. It starts empty and fills up as the page moves through the graph.

**[step 1]** The second is Ready: which stages are allowed to start on this page, meaning the page is now waiting in that stage's queue. These two rows are the entire record.

**[step 2]** In the DB it is one row per page: the page, the Finished number and the Ready number. A new page starts with Finished at 0, nothing done, and Ready at 1: only seat 0, Understand, may start. When a page has finished its last stage the row is deleted, so the record only ever holds pages that are in flight, not the whole dataset.

## 63. Following one page through the graph (deep dive)
*8 · Graphs of stages · ~2.2 min · reveal steps: 5*

Let us follow one page through a small graph, with the record on the right. Understand feeds Text and Layout, and Grounded Q&A needs both of them. Text runs on node 3, Layout on node 7, different machines.

One: a page arrives. Finished is 0, nothing is done. Ready is 1, only Understand.

**[step 1]** Two: Understand finishes. Its routing function says this is a text page, so the page goes to both Text and Layout at once. The engine switches on Ready for those two stages, and last of all switches on Understand's own Finished. Watch the numbers: Finished becomes 1, Ready becomes 7, which is 1 plus 2 plus 4. Routing is immediate: it depends on what the page contains, and the stage hands the page straight on.

**[step 2]** Three: Text finishes on node 3. Finished is now 3. Grounded Q&A needs both Text and Layout. Layout is not finished, so nothing starts. There is no message, nobody waits on a phone call. The record just says what is done.

**[step 3]** Four: minutes later, Layout finishes on node 7. Finished is now 7. Both inputs of Grounded Q&A are finished, but nobody has told Grounded Q&A, because stages never talk to each other.

**[step 4]** Five: that is the job of the sweep, a single background process. Every few seconds, five by default, it reads the records, asks for each waiting stage whether its inputs are finished, sees that they are, and switches on Ready for Grounded Q&A. The next slide shows exactly how it decides. Because it only reads the record, it does not matter which machine ran which input, or which finished first.

**[step 5]** Six: Grounded Q&A runs and finishes. It is the last stage, so the page is complete and its row is deleted.

## 64. When the sweep lets a stage start (deep dive)
*8 · Graphs of stages · ~1.1 min · reveal steps: 2*

Here is exactly what the sweep checks. For every stage that has several inputs, the engine keeps a row of the inputs it needs. Grounded Q&A needs Text and Layout: seats 1 and 2, which is the number 6. The sweep takes the page's Finished row and keeps only the switches that are also needed. In the code that is a bitwise AND: Finished AND Needs. Here the page has Understand and Text finished, number 3. Keeping only the needed switches leaves Text alone. The third row does not match the first, so Layout is missing and the stage waits.

**[step 1]** After Layout finishes, Finished is 7. Keeping only the needed switches now leaves Text and Layout, which matches the needs row exactly. Every input is finished, so the stage may start. It does not matter which machine ran which input, or in what order.

**[step 2]** The same row of switches handles the other rule, either one is enough. Write a question takes a table or a chart. A page is never both, so waiting for both would wait forever. For this kind of stage the sweep asks a weaker question: is at least one needed switch on? The chart finished, so yes, start now. Same record, same check, a slightly different question. This is why one mechanism covers every graph shape.

## 65. Ready makes a stage start exactly once (deep dive)
*8 · Graphs of stages · ~1 min · reveal steps: 2*

The sweep does not run once, it runs again and again, every few seconds. So we need to be sure it starts a stage once, not at every pass. Sweep one: Text is finished, Layout is not, so the stage waits. Sweep two: both finished and Ready is off, so the sweep switches Ready on and the page goes into the stage's queue. Exactly once so far.

**[step 1]** Sweep three, four, five: the inputs are still finished, they will always be, so the check still matches. But Ready is already on. The sweep only starts stages whose Ready switch is off, so it skips this one.

**[step 2]** Without the Ready switch, every sweep would match and the stage would start again and again, producing duplicates of the same page, which we would pay for in GPU time and train on. So the two rows divide the job: Finished says what the inputs have done. Ready remembers what has already been started. That is why a stage starts exactly once, whichever order its inputs finish in.

## 66. A crash between writes never loses a page (deep dive)
*8 · Graphs of stages · ~1.2 min · reveal steps: 2*

One more thing we need: crashes. When a stage finishes a page it makes three writes to the DB. It puts the page in the next stage's queue. It switches on Ready for that stage. And it switches on its own Finished. A machine can die between any two of them, so which order do we use? On the right is the reverse order, for comparison.

**[step 1]** Suppose the machine crashes in the middle. In our order, on the left, the page has been handed on but the stage's own Finished is still off. Remember the recovery rule from Part 7: anything not marked finished is picked up and run again. So after the restart the page is run again and the three writes repeat. That is fine because every write is safe to repeat: the queue row already exists, the Ready switch is already on, and switching on a switch twice changes nothing. On the right, Finished is switched on first. Crash straight after, and the record says this stage is finished, so nobody runs it again, while the next stage was never given the page. The page is lost. The same ordering applies when the sweep starts a stage: queue first, then Ready, so a crash between them just means the next sweep does it again.

**[step 2]** So the rule is: hand the page on first, mark yourself finished last, and make every write safe to repeat. It is the same save-first rule from Part 7, applied between stages.

## 67. From idea to a running pipeline
*8 · Graphs of stages · ~0.8 min · no steps*

So a DAG can describe almost any workload we have. And once you define it, running it is very simple. Two parts, then one command.

Part one: you define the DAG. What the stages are, and which ones feed which.

Part two: you define what each stage does: the prompt, and what a good answer looks like.

And you run one command on every machine. After anything goes wrong, you run the same command again. There is no step for recovery, retries, coordination or scaling, because those were designed once and every pipeline shares them. The same engine has run transcription, HTML conversion, chart reading, question answering and dozens of other pipelines. And once the DAG is defined, the engine runs all of its stages in parallel. Here is what that buys.

## 68. All stages at once
*8 · Graphs of stages · ~1.2 min · no steps*

Once the DAG is defined, the engine runs all of its stages at the same time, automatically. Why does that matter? The obvious way is one stage at a time: run stage one over everything, wait, check, then launch stage two. It is simple and it is how most groups start. We did too. This is the same work on the same hardware, twice. Press play, or drag the slider to stop both runs anywhere.

Watch the big number on each side. On top, stage by stage: nothing usable exists until the last stage begins, and a person has to notice each stage finish and launch the next, for days. Below, every stage running at once: each record moves on as soon as it is saved, so finished examples start arriving almost immediately. Both runs finish at the same moment, because they do the same work. What changes is when usable results arrive.

If asked for a measured number: in the paper, a four-stage pipeline over 10 to the 5 pages on 16 emulated nodes produced its first thousand usable records after 10.7 minutes, against 81 minutes stage by stage. The counters on the slide are a simulation of a million examples.

## 69. What Patram-Ingest supports
*8 · Graphs of stages · ~0.6 min · no steps*

Putting it together, this is what the graph layer of Patram-Ingest supports; the cards appear on their own. A graph is a list of stage declarations: each stage names its upstream stages, a policy for waiting on them, and optionally a routing function. Stage authors never see the graph.

It supports any graph shape, declared in a few lines of code: straight chains, fan-out where one stage feeds many, and per-sample routing, where a routing function inspects what a stage produced and returns the stages to send each sample to.

Fan-in with two policies: a stage can need every input, or start as soon as one arrives.

Failure propagation: if a stage fails a sample, every later stage marks it upstream-failed when it next looks, so no stage waits forever for an input that will never arrive; resetting a derived upstream-failed is always safe, which makes fix-and-rerun possible.

Validation at start-up: acyclicity, reachability, routing-target isolation and the split between the two activation paths. And every output records the stages its sample passed through, so any record can be traced through the graph. Bit positions are stored in 64-bit integers; a wider bit string would serve any number of stages. Graphs are acyclic.

## 70. Scaling compared with DBOS and Temporal
*8 · Graphs of stages · ~1.5 min · no steps*

Very few alternatives come close to these features. Among the 13 systems in our comparison, only DBOS and Temporal do: they already survive crashes, route per sample and run across machines. So we ran the same pipeline on both, on the same DB server and the same emulated model servers. We made the servers answer in 20 milliseconds, so inference could not be the limit, and added nodes until throughput stopped growing.

DBOS gained nothing from nodes past 16: about 1,350 pages per second at 16 nodes and at 40. Temporal peaked at 546 on 4 nodes and stayed between roughly 260 and 390 from 8 to 32. In both, the database's replication path was saturated: most DBOS backends were waiting inside a commit for the standby.

Ours kept growing with every added node, to 8,571 pages per second at 32 nodes, which is 6 times DBOS and 28 times Temporal, with the database mostly idle. Why: the database only holds state, a few small rows per page, written in the background in groups; the results themselves go to files on each node, and no node ever waits on another. A driver replaying our statements with no model calls reached over 13,000 pages per second, so the database could give more.

And the overhead stays tiny as nodes are added. Against a bare client that reads prompts from a file and writes answers to local disk, with no database at all, we reach 98.9 to 99.7 percent of its throughput at every scale from 1 to 48 nodes. Throughput grew from 3.88 requests per second on one node to 183.6 on 48, which is 98.6 percent of linear. Caveat: this is one deployment of each system, each configuration ran once, and the servers were emulated.

## 71. Key takeaways
*9 · Wrap-up · ~1 min · no steps*

If you take six things away from the Patram-Ingest half, these are the lessons we learned the hard way.

One: expect failure; it is not an anomaly. Over weeks on a shared cluster, every step will at some point crash in the middle, so design every step for that, instead of treating it as a rare exception.

Two: single responsibility. Every component does exactly one job. A stage only transforms a sample: it does not know the graph, retry, coordinate or scale. Those live once in the engine, which is why a new pipeline is a few lines of code, and why a bug in one stage cannot break recovery.

Three: follow every error through to the end. Every error lands somewhere definite: a system problem is retried, a bad sample is set aside with its reason, and if you cannot tell which, you retry, because a retry costs seconds and a good sample thrown away is gone. Nothing is left stuck in between.

Four: no indefinite waits. A process that is killed while holding a shared lock never releases it, and every other worker blocks on it for good. So nothing that needs a lock is shared between workers that can die: each worker gets its own private inbox, and no process can end up stuck waiting on one that is gone.

Five: match the parallelism to the job. Processes for computing, threads for waiting, event loops for many calls at once.

Six: keep the database light. It holds only state; the results go to files on each node, written in groups, off the GPU's path. That is why the system keeps scaling as nodes are added.

## 72. The DB is the single source of truth
*9 · Wrap-up · ~0.8 min · no steps*

If you remember one thing from this half of the lecture, make it this. Nowhere in the whole system, in the stage workers, the worker pools, the supervisors, the watchers, the model servers or the nodes, do we keep any state. Every one of them is stateless. The entire state of the run, what is waiting, claimed, done or failed, lives in one place: the DB. It is the single source of truth. Results go to files, and the DB says which ones count.

That one decision is where the distributed-system guarantees come from. Any component can crash and restart at any moment, like the stage worker here, and we survive it, because it held nothing: it simply reads the DB and carries on. Nodes can join or leave at any time, because there is nothing to hand over. And recovery is just a query on the DB, not a procedure someone has to run.

## 73. Where Patram-Ingest sits in the stack
*9 · Wrap-up · ~1.2 min · reveal steps: 2*

To step back: Patram-Ingest, everything in the second half, is just one part of the infrastructure we have.

**[step 1]** There is a lot supporting it from below: our storage layer, Patram-FS and Patram-DB, the scraper and our synthetic documents that bring raw data in, and DarshinAI for annotation and visualization.

**[step 2]** And above it, Patram-Core takes this data, our training corpus, and makes it possible to train models. Using all of this, we have trained many foundation models, the Patram Suite, and evaluated them on our own benchmarks. These are internal models as of now; we plan to release the Patram series soon, and the sign-up form is on the next slide.

## 74. The same ideas in both systems
*9 · Wrap-up · ~1.5 min · no steps*

Here are the two systems side by side. You do not need to remember the table. The point is that the rows are the same. Both have to decide where work waits, who picks it up, how to balance load, which kind of concurrency to use and how pieces communicate. These are the questions of systems programming, and they do not change when the workload is AI.

The answers differ because the goals differ, as the last row shows. vLLM keeps its queues in memory because it must be fast for each request. We keep ours in a DB because a run has to survive machines dying. Neither is the right answer in general. Each one is right for its goal. When you design your next system, start with that last row.

## 75. Try it yourself
*9 · Wrap-up · ~1 min · no steps*

If you want to take this further, here are four exercises, from easy to harder. The first needs a GPU and a small model. The second only needs patience with a debugger; the author of the walkthrough says that is the best way to learn this codebase, and we agree. The third and fourth need no GPU at all, and teach you the two failure lessons from Patram-Ingest in about a hundred lines of Python each. The third will hang intermittently, so you may have to run it many times, just as we did.

On the right is what to read. Start with the Inside vLLM walkthrough. We followed it closely for the first half, and it goes much deeper than we could today.

## 76. Thank you
*9 · Wrap-up · ~0.6 min · no steps*

To bring it together: experts built vLLM to run a model as well as the hardware allows, and we built Patram-Ingest around it to keep using it for weeks, on a cluster where nodes die and GPUs come and go. Both are made of ideas you are learning now: scheduling, memory, queues, processes, threads and databases. Thank you. There are two codes on the right: the first is the sign-up form for the Patram series, so we can let you know when it is released, and the second is our hiring form, which is open to students who enjoyed this. Scan whichever is useful. We are happy to take your questions.

**Likely questions.** Why not Kafka or Redis? Every extra component is a new way to fail, and the database costs a small fraction of runtime. What if the DB dies? Results on disk stay safe because saving comes first; with a managed high-availability DB a failover takes about 20 seconds and workers reconnect within a 30-second budget; if the database stays down longer the run aborts and nodes reclaim their rows at next start. Why not per-sample fsync? It is slow on a network filesystem, and the commit group bounds the redo. What about step-level durability? Use DBOS or Temporal for that; our bound is the commit group. Who decides to add nodes? Today a person or a script starts the program on a node; the run then uses it without any other change. A scheduler that decides on its own is the next step.
