---
order: 2
title: A payroll ERP mapped with the people who run payroll
company: Eddekhar
role: Full Stack Mobile Engineer
period: Mar 2023 to May 2024
figure: 1,400
figureLabel: employees paid across 5 companies
cover: /work/eddekhar-home.jpg
anchor: end
---

## The problem

Five companies needed a single system for payroll, finance and treasury, used by finance teams, HR, management and the employees being paid.

## What we learned

I interviewed finance teams, client HR, management and employees, and kept those conversations going from the MVP through to full release. Analytics and funnel telemetry in production showed where users dropped off, and fed the roadmap.

## What we built

- An in-house ERP for payroll, finance and treasury, with web dashboards and a React Native app built with Expo.
- REST APIs and a Neo4j data model linking employees, organizations and payroll records, with caching and pagination for heavy reports.
- Production environments on AWS and GCP: access control, certificates and DNS, automated backups and recovery, and controlled database migrations.
- A team of five engineers, which I led.

## Technical decisions

**A graph database for an org chart.** Employees, companies, departments and payroll records are relationships first, so we modelled them in Neo4j. Fewer engineers know Cypher, which made onboarding slower. It is also what took reports from a week to a day.

**One mobile codebase.** The app was built with React Native and Expo, so a team of five could ship iOS and Android together, at the cost of some native features being harder to reach.

**Migrations treated as releases.** Every production schema change got a backup first, a staged rollout and a written rollback plan. They ran with zero downtime.

## Result

The system pays salaries for 1,400 employees across five companies, and report turnaround went from a week to a day.

## How we measured

- **1,400 employees:** the number of people on the monthly payroll run across the five companies.
- **A week to a day:** time from closing a pay period to the finance reports being ready, before and after the new data model.
