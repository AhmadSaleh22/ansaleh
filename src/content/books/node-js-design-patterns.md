---
order: 2
title: Node.js Design Patterns
author: Mario Casciaro & Luciano Mammino
cover: /books/node-js-design-patterns.jpg
status:
---

This isn't a book about the classic design patterns translated into JavaScript. It starts from how Node.js actually runs code, one thread and an event loop, and shows which patterns make sense because of that, which ones change shape, and which ones you don't need at all.

## The platform under the patterns

Node.js is built around the reactor pattern. Instead of blocking while it waits for a file or a network call, it hands the work to libuv and moves on, and a handler runs when the result is ready. Everything else follows from this: code must never block the event loop, and the unit of composition is a callback, a promise or an event rather than a thread.

The module system gets its own chapter, and it's more useful than it sounds. Understanding how CommonJS loads and caches modules, and how ES modules differ with static imports and live bindings, explains a lot of confusing behaviour, from circular dependencies to why a module is only evaluated once.

## Callbacks, events and Zalgo

The early chapters are about the most basic contract in Node.js: a function that takes a callback should call it asynchronously every time, or synchronously every time, never sometimes one and sometimes the other. The authors call that inconsistency "unleashing Zalgo", and it's behind a whole class of bugs that only appear when a cache is warm. The fix is simple once you know it: defer the callback with process.nextTick or a resolved promise.

Callbacks and the EventEmitter are two ways of answering the same question. A callback reports one result; an emitter reports many events over time. Choosing the wrong one is how APIs become awkward to use.

## Control flow without the pyramid

The book builds the same small web spider several times: first with callbacks, then with promises, then with async/await. Each version shows the same three shapes: tasks in sequence, tasks in parallel, and tasks in parallel with a limit on how many run at once. The limited version, a queue that never runs more than a set number of jobs, is the one that matters most in practice, because unbounded parallelism is how you exhaust file handles, database connections or someone else's rate limit.

Async/await makes this read like normal code, but it's easy to slip back into running things one at a time by awaiting inside a loop. Knowing when to collect promises and await them together is the difference between a request that takes one second and one that takes ten.

## Streams

Streams are where Node.js feels most like itself. Instead of loading a whole file or response into memory, data flows through in chunks, and backpressure stops a fast producer from drowning a slow consumer. Readable, writable, duplex and transform streams compose with pipeline, which also handles errors and cleanup, something that hand-rolled pipe chains tend to get wrong.

## Classic patterns, Node.js style

The creational, structural and behavioural chapters revisit the familiar patterns with a JavaScript accent. Factories replace many uses of classes. The revealing constructor exposes private capabilities only at construction time, the way the Promise constructor hands you resolve and reject. Proxies and decorators wrap objects to add behaviour, and middleware, the pattern behind Express, turns out to be a pipeline of small functions that each decide whether to pass the request on.

Dependency injection comes up as a way of wiring modules together. Passing dependencies in, instead of importing them directly, makes code easier to test and to change later.

## Recipes for real systems

### Work that takes time

A few recipes come up in almost every backend. Components that need async setup, like a database client, can queue calls until they're ready instead of forcing every caller to wait. Identical requests that arrive together can be batched so the expensive work runs once, and the result can be cached briefly to absorb the next burst. Long operations should be cancellable.

### Work that uses the CPU

CPU-heavy work blocks the event loop for everyone. The options, in order of effort, are splitting the work into steps with setImmediate, moving it to a child process, or running it in worker threads.

## Scaling and messaging

The last chapters move from one process to many. The scale cube gives three directions to grow: run more copies, split by function into services, or split by data. Node.js makes the first easy with the cluster module or a reverse proxy, and the book is frank about the cost of the second, from service discovery to data that now lives in several places.

Messaging ties it together. Publish/subscribe, task queues, request/reply and the choice between a broker and a peer-to-peer setup are the same patterns from the start of the book, events and queues, applied across machines instead of inside one process.

## What I'm keeping

Most problems in Node.js come down to respecting the event loop and controlling concurrency. If nothing blocks it, every callback behaves consistently, and every batch of async work has a limit, the rest is ordinary design.
