---
order: 4
title: Rebuilding a MedTech site around how clinics work
company: Marham Care
role: Software Engineer (part-time)
period: Nov 2024 to Mar 2025
figure: 2,000
figureLabel: monthly visitors on the platform
cover:
diagram: structure
---

## The problem

Marham Care runs a MedTech publishing platform used by doctors and clinic staff. It needed a structure that fits how they work, and releases that don’t break it.

## What we learned

I interviewed doctors and front-desk staff and watched them use the platform, then restructured the site’s information architecture around how they work.

## What we built

- React and TypeScript frontends for the publishing platform, rendered dynamically on SharePoint Classic.
- Jest and SuperTest unit and integration tests as a gate on every release.
- CI/CD pipelines on Jenkins and Bitbucket with test gates and deployment checks, so a small team can ship safely.

## Technical decisions

**Tests as a gate, not a suggestion.** Jest covers the units, SuperTest covers the API end to end, and a failing test blocks the deploy. For a small team that makes merging a little slower and releases a lot calmer.

**Structure from observation.** The information architecture follows how doctors and front-desk staff actually look for things, not how the content was stored.

## How we release

The Jenkins and Bitbucket pipeline runs the same steps every time: build, run the tests, deploy, then run deployment checks against the live site. Nothing reaches production by hand.

## Result

Fewer regression bugs reach users, and production incidents are usually resolved within about an hour.

## How we measured

- **2,000 visitors:** monthly visitors from the site’s analytics.
- **About an hour:** time from an incident being reported to the fix being live, from the team’s incident history.
