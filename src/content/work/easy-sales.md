---
order: 5
title: Finding out why active users weren’t buying
company: Easy-Sales AI
role: Software Engineer (while completing B.Sc.)
period: Feb 2021 to Aug 2022
figure: +$300K
figureLabel: in sales within two months, a 200% increase
cover:
diagram: revenue
---

## The problem

Easy-Sales AI, a sales SaaS based in Canada, had healthy usage and weak revenue. People came back to the product, but few of them paid for it.

## What we learned

User research and behaviour analytics pointed to three causes: pricing, timing, and low purchase intent. The product wasn’t failing. The purchase journey was.

## What we built

- Time-limited offers.
- Changes to pricing and the free trial.
- Simpler onboarding that new customers could finish the same day.
- Behaviour analytics and reminder notifications.
- A machine-learning inference service on AWS Lambda and SageMaker, and the React prioritization UI that turned its predictions into a daily list for account managers, on a platform with 6,000 monthly visitors.
- Python and Bash automation for infrastructure setup, cutting manual work.

## Technical decisions

**Fix the journey before the model.** The predictions were already good enough. Changing the offer, the trial and the onboarding moved revenue faster than another round of model work would have.

**Serverless inference.** The model ran on SageMaker behind AWS Lambda, so the team paid for predictions when they were used instead of keeping servers running for a product still finding its buyers.

## Result

Sales grew by $300K, a 200% increase, within two months. It was the project that taught me to start with the people using the software before touching the code.


## How we measured

- **+$300K, +200%:** sales in the two months after the changes compared with the two months before, from the billing data.
- **6,000 visitors:** monthly visitors from the product’s analytics.
