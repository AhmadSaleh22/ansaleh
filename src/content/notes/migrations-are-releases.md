---
title: Migrations are releases too
date: 2026-09-27
summary: Code can be rolled back in a minute. Data can’t. Treat schema changes with the same care as a deploy, or more.
---

A bad deploy is usually fixed by deploying the previous version. A bad migration can lose data you can’t get back. Yet teams often review application code carefully and run schema changes with a single command at the end of the day.

I’ve run production migrations on two very different systems: a Neo4j-backed payroll ERP at Eddekhar, where a mistake affects people’s salaries, and more than fifteen Prisma migrations on GCP at G-Gateway. The rules I follow are the same on both.

## The rules

1. **Migrations only, never by hand.** Every schema change is a migration file in the repository, reviewed like code. If it isn’t in version control, it didn’t happen.
2. **Back up first.** Take a backup right before running the migration and check that it can be restored. A backup you haven’t tested is a hope.
3. **Stage the rollout.** Run it on a copy of production data first. Then run it in production at a quiet time, with someone watching.
4. **Keep the old code working.** Add new columns or fields before the code that uses them, and remove old ones only after nothing reads them. The running service should never see a schema it doesn’t expect.
5. **Write the way back.** For each migration, write down how to reverse it, or say plainly that it can’t be reversed and what the backup plan is.

## What this buys you

At Eddekhar, migrations ran with zero downtime while payroll kept running for 1,400 employees. The process is slower than typing one command. It is much faster than restoring a payroll database on payday.
