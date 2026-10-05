---
order: 3
title: Job matching that answers in under a second
company: G-Gateway
role: Full Stack Developer (contract)
period: Jun to Oct 2024
figure: <1 s
figureLabel: match feedback for candidates
cover:
diagram: matching
---

## The problem

G-Gateway needed real-time job matching for candidates, including jobs across several locations.

## What we built

- The real-time job-matching feature end to end, with the PM and designer, from API contract to UX, including multi-location filtering.
- Event-driven services in Node.js and Python on GCP Pub/Sub and Cloud Run, with an Angular and RxJS client.
- A reusable Angular component library with Tailwind and Angular CDK, so the candidate journey stayed consistent and accessible.
- More than 15 production schema migrations with Prisma, rolled out in a controlled way to protect existing data.

## Technical decisions

**Events instead of direct calls.** Matching runs as messages on Pub/Sub, so a slow step never blocks the candidate’s screen. The cost is that failures are harder to trace, so I followed issues end to end across the services, the APIs, the database and the queue.

**Cloud Run for the services.** They scale with traffic and there are no servers to look after. The trade-off is cold starts, which matter less for background matching than for the screen the candidate sees.

**Schema changes only through migrations.** Every change went through a Prisma migration, reviewed like code and rolled out in a controlled way. Nothing was edited by hand in production.

## Result

Candidates got match feedback in under a second, and match coverage grew with multi-location filtering.

## How we measured

- **Under a second:** time from a candidate’s action to the match result appearing, from timestamps on the request and on the messages it produced.
- **15+ migrations:** counted from the project’s migration history.
