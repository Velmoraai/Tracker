# JEE Ascension — Adaptive Campaign

A single-file-friendly static website for turning JEE preparation into an adaptive game.

## Files
- `index.html` — app structure
- `style.css` — responsive/iPad-friendly styling
- `app.js` — campaign engine, local storage, quests, challenges, timer, tests
- `README.md` — this guide

## Core loop
1. Enter today's available study time.
2. The Reality Check compares it with demonstrated productive capacity.
3. Start Today's Campaign.
4. Complete essential quests.
5. Get a challenge matched to the situation.
6. Log productive/break/lost time.
7. Record tests; the app creates a weakness quest.
8. Repeat.

## Reality Check
- Demonstrated capacity = average of recent logged sessions (up to 7 sessions).
- Campaign target ≈ 82% of demonstrated capacity.
- >115% of demonstrated capacity: UNREALISTIC.
- >90%: AGGRESSIVE.
- <55%: UNDER-PLANNED.
- Otherwise: REALISTIC.

The thresholds are intentionally practical rather than motivational. The app is allowed to tell you to reduce a plan or to add difficulty.

## XP / ability stats
XP is awarded for quests, challenges, productive time and test analysis.
Ability stats track:
- Conceptual Understanding
- Application
- Unfamiliar Problems
- Speed
- Accuracy

## Hosting
This is a static site. Upload all three website files (`index.html`, `style.css`, `app.js`) to a GitHub repository and enable GitHub Pages from the `main` branch, root folder.

No server or database is required. Progress is stored in the browser using localStorage.

## Important
This version is a campaign engine, not a replacement for your actual JEE schedule. Use it to challenge workload assumptions and track execution; keep your coaching/test syllabus as the source of truth.
