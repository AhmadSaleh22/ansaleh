---
order: 1
title: Designing Data-Intensive Applications
author: Martin Kleppmann
cover: /books/designing-data-intensive-applications.jpg
status:
---

Most applications are limited less by computing power than by data: how much of it there is, how complex it is, and how fast it changes. The book takes the tools we reach for every day, databases, caches, queues and search indexes, and opens them up so you can see the trade-offs each one makes. It doesn't tell you which product to pick. It teaches you which questions to ask before you pick one.

## The three words that frame everything

Kleppmann starts with reliability, scalability and maintainability, and defines each one carefully enough that they stop being buzzwords. Reliability means the system keeps working when things go wrong, and things will go wrong: disks fail, people make mistakes, software has bugs. The goal isn't to prevent every fault but to stop faults from turning into failures.

Scalability is not a property a system has or lacks. It only makes sense once you describe the load, such as requests per second or the fan-out of a single write, and then ask what happens when that load grows. Percentiles matter more than averages here, because the slowest requests often belong to the users with the most data, who are usually the most valuable ones.

Maintainability gets the least attention and causes the most pain. Operability, simplicity and the ability to change the system later decide how much of the team's time goes into keeping the lights on.

## How data is stored

### Two families of storage engines

Underneath every database is a choice between two ideas. Log-structured engines append writes to a file and merge sorted segments in the background, which makes writes very fast. B-trees keep data in fixed-size pages and update them in place, which gives predictable reads and is still the default in most relational databases. Once you know which one you're on, a lot of performance behaviour stops being mysterious.

### Transactions versus analytics

Systems that serve users read and write a few rows at a time. Systems that answer business questions scan millions of rows but only a few columns. That difference is why data warehouses store data by column rather than by row, and why trying to run heavy reports on the production database usually ends badly.

### Changing the shape of data

Data outlives the code that wrote it. Old and new versions of an application run side by side during every deploy, so data has to stay readable in both directions. Formats like Protocol Buffers and Avro make backward and forward compatibility explicit, and the chapter is a good argument for treating schema changes as something to design, not just something to run.

## When data lives on more than one machine

### Replication

Copying data to several machines sounds simple until you ask what a user sees right after they write something. With a single leader and asynchronous followers, a user can save a change and then read an older copy from a follower. The book names the guarantees that close these gaps, reading your own writes, monotonic reads and consistent ordering, and shows what each one costs.

### Partitioning

When one machine can't hold the data, it gets split. Splitting by key range keeps related data together but creates hot spots, while splitting by hash spreads load evenly but makes range queries expensive. Secondary indexes and rebalancing are where most of the real difficulty hides.

### Transactions and isolation

This is the densest chapter in the book. "ACID" is a loose label, and isolation levels in real databases are weaker than most people assume. Read committed and snapshot isolation still allow lost updates and write skew, where two transactions each check a condition, both see it as true, and together break it. Serializable isolation prevents this, and the book walks through the three ways to get it: running transactions one at a time, two-phase locking, and serializable snapshot isolation.

## The trouble with distributed systems

Networks drop and delay messages, clocks drift, and a process can pause for seconds in the middle of its work without knowing it. A node can't trust its own sense of time, and it can't tell a slow peer from a dead one. Fencing tokens are a good example of the mindset the book encourages: instead of assuming a lock is still held, every write carries a number the storage can check.

## Consistency and consensus

Linearizability makes a distributed system behave as if there were one copy of the data, and it's expensive. Kleppmann is sceptical of the CAP theorem as a design tool and prefers to talk about the actual guarantees and their costs. Consensus, getting several nodes to agree on one value, turns out to be the same problem as total order broadcast, leader election and atomic commit, which is why tools like ZooKeeper and etcd sit underneath so many systems.

## Derived data

The last part reframes a system as data flowing from a source of truth into derived views: caches, search indexes, analytics tables. Batch processing, change data capture, event logs and stream processing are all ways of keeping those views in step with the source. Seeing it this way makes it easier to rebuild a view when it's wrong, because the log of what happened is still there.

## What I'm keeping

There's no best database, only trade-offs that match a workload or don't. The useful habit is to ask, for any piece of data, where it's written first, how it gets copied, what a reader might see in between, and what happens when a machine or the network fails halfway through.
