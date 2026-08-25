# Calendar

A study planner, to-do list and session timer in one page. No build step, no backend, no account — plain HTML, CSS and JavaScript, with everything saved in your browser's local storage.

## Put it online

1. Make a new GitHub repository and push these files to the root of it:

   ```bash
   git init
   git add .
   git commit -m "Calendar"
   git branch -M main
   git remote add origin https://github.com/<you>/calendar.git
   git push -u origin main
   ```

2. Go to vercel.com → **Add New → Project** → import the repo.
3. Leave every build setting empty. Framework preset: **Other**. Build command: none. Output directory: none.
4. Deploy.

There is nothing to configure. To work on it locally, open `index.html` in a browser, or run `python3 -m http.server` in this folder.

## Where your data lives

In `localStorage`, under the key `calendar.v1`, in the browser you are using. That means:

- It survives refreshes and redeploys.
- It does **not** follow you to another device or another browser.
- Clearing site data wipes it.

Setup → Your data has **Export backup** and **Restore backup**. Use them.

## Getting started

Setup has a **format guide**. Copy it, paste it into Claude along with your timetable, exam schedule or deadline list in whatever messy form you have it, and paste the CSV that comes back into the import box.

Or press **Load a sample** to fill the app with fake data and click around first. Setup → Your data → Delete everything clears it out afterwards.

## The import format

One record per line. First column is the record type. Quote any field containing a comma.

| Type | Columns |
|---|---|
| `SUBJECT` | name, color |
| `CLASS` | subject, day, start, end, room |
| `EXAM` | subject, title, date, kind, notes |
| `TODO` | subject, title, due, link, description |

- `day` — Mon…Sun. `start` / `end` — 24-hour `HH:MM`.
- `date` / `due` — `YYYY-MM-DD` (or `DD/MM/YYYY`).
- `kind` — `exam`, `test`, `ia` or `deadline`.
- Subjects mentioned anywhere are created automatically, so `SUBJECT` lines are only needed to fix colours.

```
SUBJECT,Physics HL,#5b8def
CLASS,Physics HL,Mon,08:30,09:45,Lab 2
EXAM,Physics HL,IA final draft,2026-09-30,ia,"2200 words, full error analysis"
TODO,Maths AA HL,Exercise 7C q1-14,2026-09-02,,
```

## What's in it

**Dashboard** — today's date, a countdown ticket for every upcoming exam and deadline, today and tomorrow side by side with a start button, and the to-do list pinned to the right.

**Study** — a grid ruled in 5-minute steps, one to ten hours tall. Drag on empty space to block out time; drag a block to move it or its edges to resize. Each block takes a subject, a title, detail, links and any number of check-ins, and can be pulled straight from a to-do. Schedule coffee and lunch breaks; they are excluded from studied time. Press start and a red line tracks the present moment down the grid — blocks it has passed lock, everything ahead stays editable. Studied, to-go, planned and current-block figures update every second, and **PiP** pops them into a floating window that stays on top of other apps (Chrome and Edge).

**To-dos** — grouped by subject and colour-coded, with links and notes. Due dates can be **next class** or **the class after that**, calculated from your timetable, and the option tells you which day that lands on.

**Calendar** — a month view of deadlines, sessions and due tasks. Double-click a day to plan a session on it.

**Analytics** — hours by time of day, by weekday, by week and across the last fortnight; a subject split; progress against your weekly target with the pace needed to hit it; and a set of written observations about when and how consistently you actually work. The 40-hour target is adjustable in Setup.

**Setup** — imports, the format guide, subject colours, the weekly timetable, deadlines, preferences, and selective or total data deletion.

## Files

```
index.html          shell and script tags
styles.css          all styling, both themes
js/store.js         state, persistence, time maths, CSV parser
js/ui.js            element builder, modals, toasts
js/dashboard.js     landing page
js/todos.js         to-do list, editor, next-class due dates
js/session.js       the 5-minute grid, live timer, PiP
js/calendarview.js  month view
js/analytics.js     charts and observations
js/settings.js      setup, imports, format guide, data control
js/app.js           routing and the one-second heartbeat
```

Scripts are plain classic scripts sharing one global scope — no modules, no bundler. Add a file, add a `<script>` tag, done.
