---
order: 1
title: Production planning that operators finish in half the time
company: Syntax
role: Frontend Lead
period: Apr 2025 to Sep 2026
figure: −50%
figureLabel: planning time across 10 plants
cover:
diagram: planning
---

## The problem

Syntax builds the cloud-based platform that operators in 10 manufacturing plants use to plan production. Planning a line was slow, and the reports managers depended on were assembled by hand.

## What we learned

Before designing anything, I interviewed operators and watched them plan on site. Then I mapped the planning journey from start to finish, so the team could see every step an operator takes and decide which ones to rebuild first.

## What we built

- Planning views built on system recommendations, so operators start from a suggested plan.
- Decision views that turn machine and production-line data into what to produce more of, when, and how to improve products.
- A real-time 3D factory view with filtering, modals and data tables, in place of manual reporting.
- A design system of more than 25 components, built with the design team to WCAG.
- Frontend architecture and engineering standards adopted by 6 engineers.

## Technical decisions

**Design system before features.** We spent the first weeks building shared components with the design team instead of screens. It slowed the start. It is also why later features shipped 40% faster and look the same in every plant.

**Start from a recommendation, not a blank plan.** Operators edit a suggested plan instead of building one from scratch. The risk is trust: nobody uses a plan they don’t understand, so each view shows the machine and line data the suggestion comes from.

**Standards in writing, not in review comments.** The architecture and coding standards live in documents the six engineers agreed on. Reviews stopped arguing about style and started looking at behaviour, which is where the 30% came from.

## How we release

Four major releases, zero rollbacks. That came from a process, not luck:

1. **Every change is reviewed** against the written standards and has to pass type checks, linting and tests before it can merge.
2. **Each release has a checklist**: configuration changes, data changes and known risks are written down and signed off before deploy.
3. **Release candidates are checked with operations** on production-like plant data before they go live.
4. **Changes stay backward compatible**, so nothing in production depends on a single switch being flipped at the right moment.
5. **After deploy, we validate in production** with the operations team: the critical planning flows are walked through and the logs watched for errors.
6. **Every release has a rollback plan.** We haven’t needed one yet.

## Result

Planning time fell by half. The design system cut feature delivery time by 40%, and the shared standards cut code review cycles by 30%. We shipped four major releases with zero rollbacks, and data-heavy screens load in under 100 ms.

## How we measured

- **Planning time:** timed operators planning the same kind of production run before and after the redesign, in observed sessions, and compared the medians.
- **Under 100 ms:** measured in the browser on production-size plant data, from the data arriving to the screen being usable.
- **Feature delivery, −40%:** average time from starting a feature ticket to merging it, for comparable features before and after the design system.
- **Review cycles, −30%:** review rounds per pull request before merge, over a comparable period before and after the standards.
- **Zero rollbacks:** no major release was reverted after deploy.
