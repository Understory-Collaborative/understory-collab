---
title: "Why I hate RACIs"
slug: "why-i-hate-racis"
date: "2026-10-10"
author: "webs"
excerpt: "The problem RACIs are trying to solve is real. The execution is where it falls apart."
category: "\[webs: pick one, for example Delivery\]"
tags: "RACI, roles, cross-functional teams, decision making"
draft: true
source: "drive"
driveId: "1ZqdGCYEOoO9QU8DtFUw6HCRtPRg1niD5qT-Rw6p4u2g"
updated: "2026-10-10"
---

The problem RACIs are trying to solve is real. On cross-functional work, people drop balls, duplicate effort, and argue about who gets to make the call. At some point someone looked at that chaos and thought, what if we just wrote down who does what? Genuinely a useful instinct.

The execution is where it falls apart.

Every single time I have watched a team build a RACI, someone asks the same question within the first ten minutes. Isn't the person responsible also accountable? The meeting that was supposed to create clarity turns into a vocabulary lesson about the difference between two words that most dictionaries define in terms of each other. A tool built to resolve ambiguity should not require a glossary to operate.

But the vocabulary problem is just the beginning.

RACIs are built around individual assignment, one R per row, one A per row. That assumption breaks immediately on cross-functional software teams, where two or three people are genuinely co-doing the same thing. Developers and product owners are not taking turns. They are building understanding together, negotiating constraints in real time, and arriving at solutions that neither of them could have reached alone. RACI has no column for that. It forces you to pick one person as Responsible and demote everyone else to Consulted, which misrepresents how the work actually moves.

Then there is the political theater problem. The research on this is almost comical in how consistent it is. Teams spend weeks fighting over the matrix. Senior leaders grab the A column because it signals authority. People dodge the R column because it signals blame. Everyone demands a C because information is power. One documented case study ends with a color-coded matrix spanning 200 rows and 300 columns, printed as a wall-sized poster, hung in a manager's office, and never looked at again. That is not an edge case. That is the pattern.

What is actually happening in those meetings is that RACI is functioning as a proxy fight for structural problems the organization has not named yet. The demand for a RACI is almost always a symptom of something deeper: unclear strategy, fractured trust between functions, a handoff mentality that has been mistaken for collaboration. The chart cannot fix any of that. But the conversation the chart forces can sometimes surface what actually needs to change, which is why the most honest thing practitioners say about RACIs is that whatever value exists lives in the conversation, not the artifact.

## So What Is RACI Actually For?

RACI was designed for stable, well-understood, sequential work. If you are running a compliance audit with clearly defined steps and no ambiguity about who does what, a RACI is probably fine. The work is structured, the roles are predictable, and the chart will hold its shape.

Most cross-functional software teams are not doing that kind of work. They are solving problems where goals need to be clarified through stakeholder negotiation, constraints only emerge as development progresses, and there is no clean stopping rule for when a solution is good enough. Applying a RACI there does not make the work more structured. It just makes the map look more authoritative than the territory warrants.

## The Other Tools in the Shed

The organizations most often cited as examples of effective cross-functional work mostly do not use RACI. Apple uses Directly Responsible Individuals, one named person per deliverable, listed next to every action item in every meeting. Amazon built Single-Threaded Ownership, one leader per product area with full resources and autonomy, structurally separated from everything else. Help Scout developed ARPA, which preserves the insight that some people advise and some people decide, but makes explicit that advisors have no decision-making authority.

These are not better versions of RACI. They are different tools solving different problems. And this is where a lot of people coming from large companies into smaller ones get into trouble. Someone joins a 200-person company from Apple and tries to install DRI, or arrives from Amazon with single-threaded ownership, and it does not land the way they expected. The tool is not the problem. The surrounding infrastructure that makes it work at scale does not exist yet. DRI works at Apple partly because Apple has a deep pipeline of people who already understand the culture it operates inside. You cannot lift the artifact out of that context and expect the same results.

The judgment about which tool fits the actual situation is harder to develop than any of the tools themselves, and it is nearly impossible to build inside a single large organization that has already figured out its answers.

## So What Should You Actually Do

It depends on the problem you are actually trying to solve.

If the problem is that work is falling through cracks because nobody knows who owns what, instead of reaching for a full RACI, simplify what is being asked. Who is doing the building? Who has to answer for the outcome (one name)? Who is depending on the outcome to do their own work downstream? Those three questions get you to the same place without the ten-minute detour into dictionary definitions.

If the problem is that the wrong people are making decisions without enough input, focus on the C column only, and be ruthlessly specific about what "consulted" actually means for each row.

If the problem is that people are doing redundant work because they do not know what others are handling, that is a visibility problem, not a roles problem. A shared backlog or kanban does more than a RACI.

If the problem is that functions are not collaborating well, that is likely a trust or shared understanding problem, and no coordination tool fixes that. It is worth doing some honest evaluation of the psychological safety and history between the groups before touching any process tool.

If the problem is that work keeps getting dropped at handoffs between teams, that is a dependency problem, and something like DACI or ARPA, which explicitly define decision authority at the boundary, will do more than a RACI.

The common thread here is that coordination is a context problem, not a template problem. The right framework is the one that fits what is actually breaking down, not the one that is most familiar or most recently used at your last company.

If you are not sure which fits your situation, that is exactly the kind of conversation Understory Collaborative exists to have. Reach out at [contact@understorycollab.com](mailto:contact@understorycollab.com).
