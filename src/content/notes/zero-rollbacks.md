---
title: Zero rollbacks is a process, not luck
date: 2026-08-23
summary: The release checklist I use, and why each step is there.
---

We’ve shipped four major releases of the Syntax planning platform without rolling one back. That isn’t because the code was perfect. It’s because most problems were caught before they reached production, and the ones that did were small enough to fix forward.

Here is the process, step by step.

## Before merge

Every change is reviewed against written standards, not personal taste. Type checks, linting and tests run in CI, and a red pipeline blocks the merge. Reviews are for behaviour and design. Style is the machine’s job.

## Before release

Each release gets a short checklist: what changed in configuration, what changed in data, and which risks we already know about. Someone signs it off. Writing the risks down is what makes people look for them.

The release candidate is then checked with the operations team on production-like data. Developers test what they built. Operators test what they need on Monday morning, and they find different things.

## During release

Changes stay backward compatible. If a release only works when three things happen in the right order, one of them eventually won’t. New behaviour ships next to the old one until it’s been validated.

## After release

We walk through the critical flows in production with operations and watch the logs for new errors. Most issues show up in the first hour, so that hour is when we look hardest.

### And a rollback plan anyway

Every release has a written way back, even though we haven’t used one. Writing it forces you to notice the changes that can’t be undone, like a data migration, and to handle those more carefully.
