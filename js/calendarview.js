/* ============================================================
   calendarview.js — month grid: deadlines, sessions, due tasks
   ============================================================ */

const CalendarView = {
  cursor: null,

  view(){
    if(!this.cursor){ const n = new Date(); this.cursor = new Date(n.getFullYear(), n.getMonth(), 1); }
    const c = this.cursor;
    const monthName = ['January','February','March','April','May','June','July','August','September','October','November','December'][c.getMonth()];

    const page = el('div');
    page.appendChild(el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' } }, [
      el('h2', { text: monthName + ' ' + c.getFullYear() }),
      el('button.btn.sm', { text: '‹', onclick: () => { this.cursor = new Date(c.getFullYear(), c.getMonth()-1, 1); App.render(); } }),
      el('button.btn.sm', { text: 'Today', onclick: () => { const n = new Date(); this.cursor = new Date(n.getFullYear(), n.getMonth(), 1); App.render(); } }),
      el('button.btn.sm', { text: '›', onclick: () => { this.cursor = new Date(c.getFullYear(), c.getMonth()+1, 1); App.render(); } }),
      el('div.spacer'),
      el('button.btn.sm', { text: '+ Deadline', onclick: () => Settings.examEditor(null) }),
      el('button.btn.primary', { text: '+ Session', onclick: () => Session.newDialog() })
    ]));

    const grid = el('div.cal-grid');
    ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(d => grid.appendChild(el('div.cal-dow', { text: d })));

    const first = new Date(c.getFullYear(), c.getMonth(), 1);
    const start = startOfWeek(first);
    const todayKey = dateKey();

    for(let i = 0; i < 42; i++){
      const d = addDays(start, i);
      const dk = dateKey(d);
      const out = d.getMonth() !== c.getMonth();
      const cell = el('div.cal-cell' + (out ? '.out' : '') + (dk === todayKey ? '.today' : ''), {}, [
        el('div.cal-day', { text: String(d.getDate()) })
      ]);

      Store.state.exams.filter(e => e.date === dk).forEach(e => {
        cell.appendChild(el('div.cal-chip', {
          style: { '--cc': e.subjectId ? Store.subjectColor(e.subjectId) : 'var(--ember)' },
          text: e.title, title: e.title
        }));
      });
      Store.sessionOn(dk).forEach(s => {
        cell.appendChild(el('div.cal-chip', {
          style: { '--cc': 'var(--amber)' }, title: s.title,
          text: '▸ ' + s.title,
          onclick: () => { Session.activeId = s.id; App.go('session'); }
        }));
      });
      Store.state.todos.filter(t => !t.done && t.due === dk).slice(0,3).forEach(t => {
        cell.appendChild(el('div.cal-chip', {
          style: { '--cc': Store.subjectColor(t.subjectId) }, title: t.title, text: '□ ' + t.title
        }));
      });

      const secs = Store.secondsOn(dk);
      if(secs > 60) cell.appendChild(el('div.mono', { text: fmtDur(secs/60), style: { fontSize: '10px', color: 'var(--mist-dim)', marginTop: 'auto' } }));

      cell.addEventListener('dblclick', () => Session.create(dk, 'Study session'));
      grid.appendChild(cell);
    }

    page.appendChild(grid);
    page.appendChild(el('div', { style: { fontSize: '11.5px', color: 'var(--mist-dim)', marginTop: '10px' },
      text: 'Double-click a day to plan a session on it.' }));
    return page;
  }
};
