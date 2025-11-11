/* ===== DEBUG TIME SPOOF =====
   When DEBUG = true, the app pretends the current time started at 07:30
   and keeps running forward from there (great for testing).
*/
const DEBUG = false;      // set to false for real time
const DEBUG_H = 11;
const DEBUG_M = 30;

let debugRealStart = DEBUG ? Date.now() : 0;
let debugSimStart = (function () {
  if (!DEBUG) return null;
  const d = new Date();
  d.setHours(DEBUG_H, DEBUG_M, 0, 0); // start at 07:30 today
  return d;
})();

function getNow() {
  if (!DEBUG) return new Date();
  const elapsed = Date.now() - debugRealStart;
  return new Date(debugSimStart.getTime() + elapsed);
}

/* ===== Per-table mode flags =====
   false = only current row Liko
   true  = show Liko for all rows
*/
const tableModes = {
  timetable: false,
  praktinis: false
};

/* ===== Cards from JSON ===== */
const DATA_URL = 'cards.json';

// Load JSON cards into standard + praktinis card areas
async function loadCards() {
  const notice = document.getElementById('notice');
  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error();

    // Split cards between top and bottom panels
    const mid = Math.ceil(data.length / 2);
    const stdCards = data.slice(0, mid);
    const pratCards = data.slice(mid);

    fillCardSection('cards-standard', stdCards);
    fillCardSection('cards-praktinis', pratCards);
  } catch (err) {
    if (notice) {
      notice.style.display = 'block';
      notice.textContent = 'Could not load cards.json — showing sample cards.';
    }
    const fallback = [
      {
        title: 'Offline Mode',
        description: 'Sample card placeholder.',
        button: { text: 'Retry', href: '#' }
      }
    ];
    fillCardSection('cards-standard', fallback);
    fillCardSection('cards-praktinis', fallback);
  }
}

function fillCardSection(containerId, cards) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;

  wrap.innerHTML = '';
  if (!cards || !cards.length) return;

  const grid = document.createElement('div');
  grid.className = 'grid-inner';
  cards.forEach(c => grid.appendChild(createCard(c)));
  wrap.appendChild(grid);
}

function createCard({ title, description, button }) {
  const e = document.createElement('div');
  e.className = 'card';
  e.innerHTML = `
    <h2>${title ?? 'Untitled'}</h2>
    <p>${description ?? ''}</p>
    ${
      button
        ? `<a class="btn" href="${button.href ?? '#'}"
              target="_blank" rel="noopener noreferrer">
              ${button.text ?? 'Learn more'}
           </a>`
        : ''
    }
  `;
  return e;
}

/* ===== Canvas Snow (respects reduced motion) ===== */
(function snow() {
  const c = document.getElementById('snow-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const flakes = [];
  const COUNT = 0;

  function resize() {
    c.width = innerWidth * DPR;
    c.height = innerHeight * DPR;
    c.style.width = innerWidth + 'px';
    c.style.height = innerHeight + 'px';
  }

  function makeFlake(size = 20) {
    const off = document.createElement('canvas');
    off.width = off.height = size;
    const g = off.getContext('2d');
    g.translate(size / 2, size / 2);
    g.globalAlpha = 0.9;
    g.strokeStyle = '#93c5fd';
    g.lineWidth = Math.max(1, size * 0.1);

    g.beginPath();
    g.arc(0, 0, size * 0.1, 0, Math.PI * 2);
    g.fillStyle = '#e5f2ff';
    g.fill();

    for (let i = 0; i < 3; i++) {
      g.rotate(Math.PI / 3);
      g.beginPath();
      g.moveTo(0, -size * 0.4);
      g.lineTo(0, size * 0.4);
      g.stroke();
    }
    return off;
  }

  const sprites = [8, 12, 16, 20, 24].map(s => makeFlake(s * DPR));

  function seed() {
    flakes.length = 0;
    for (let i = 0; i < COUNT; i++) {
      const sp = sprites[Math.floor(Math.random() * sprites.length)];
      flakes.push({
        img: sp,
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        dx: (Math.random() - 0.5) * 0.5 * DPR,
        dy: (0.3 + Math.random()) * DPR,
        size: sp.width / DPR
      });
    }
  }

  function anim() {
    ctx.clearRect(0, 0, c.width, c.height);
    flakes.forEach(f => {
      f.x -= f.dx;
      f.y += f.dy;

      if (f.x < -f.size || f.x > c.width + f.size) {
        f.x = Math.random() * c.width;
        f.y = -20 * DPR;
      }
      if (f.y > c.height + 20 * DPR) {
        f.x = Math.random() * c.width;
        f.y = -20 * DPR;
      }

      ctx.drawImage(
        f.img,
        f.x - (f.size / 2) * DPR,
        f.y - (f.size / 2) * DPR,
        f.size * DPR,
        f.size * DPR
      );
    });
    requestAnimationFrame(anim);
  }

  resize();
  seed();
  anim();
  addEventListener('resize', () => {
    resize();
    seed();
  });
})();

/* ===== Time utilities ===== */
const liveClockEl = document.getElementById('live-clock');

function parseHMToMinutes(hm) {
  const [H, M] = hm.split(':').map(Number);
  return H * 60 + M;
}

// Format with hours if needed: H:MM:SS.mmm or MM:SS.mmm
function fmtMS(ms) {
  if (ms < 0) ms = 0;

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const msr = ms % 1000;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}.${String(msr).padStart(3, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}.${String(msr).padStart(3, '0')}`;
}

function updateLiveClock(now) {
  if (!liveClockEl) return;
  const pad = n => String(n).padStart(2, '0');
  liveClockEl.textContent = `${pad(now.getHours())}:${pad(
    now.getMinutes()
  )}:${pad(now.getSeconds())}.${String(now.getMilliseconds()).padStart(
    3,
    '0'
  )}`;
}

/* ===== Build tables from timetable-data.js ===== */

function buildStandardTable() {
  const table = document.getElementById('timetable');
  if (!table) return;
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';

  STANDARD_TIMETABLE.forEach(row => {
    if (row.type === 'section') {
      const tr = document.createElement('tr');
      tr.className = 'section-row type-section';
      tr.innerHTML = `<td colspan="3">${row.label}</td>`;
      tbody.appendChild(tr);
      return;
    }

    const tr = document.createElement('tr');
    tr.dataset.range = `${row.start}-${row.end}`;
    tr.classList.add(`type-${row.type}`); // type-lesson / type-break

    if (row.type === 'break') {
      tr.classList.add('break-row');
    }

    tr.innerHTML = `
      <td>${row.label}</td>
      <td>${row.start}–${row.end}</td>
      <td class="remain"></td>
    `;
    tbody.appendChild(tr);
  });
}

function buildPraktinisTable() {
  const table = document.getElementById('praktinis');
  if (!table) return;
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';

  PRAKTINIS_TIMETABLE.forEach(row => {
    if (row.type === 'section') {
      const tr = document.createElement('tr');
      tr.className = 'section-row type-section';
      tr.innerHTML = `<td colspan="3">${row.label}</td>`;
      tbody.appendChild(tr);
      return;
    }

    const tr = document.createElement('tr');
    tr.dataset.range = `${row.start}-${row.end}`;
    tr.classList.add(`type-${row.type}`); // type-lesson / type-break

    if (row.type === 'break') {
      tr.classList.add('break-row');
    }

    tr.innerHTML = `
      <td>${row.label}</td>
      <td>${row.start}–${row.end}</td>
      <td class="remain"></td>
    `;
    tbody.appendChild(tr);
  });
}

/*
  Enhance a table (countdowns + highlighting):

  - tableId: 'timetable' or 'praktinis'
  - All rows with data-range can get:
      * Liko filled into .remain
      * .now on the current row
      * .past on finished rows

  Optimization:
  - Precompute start/end minutes and target cell once.
*/
function enhanceTable(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return { tick: () => {} };

  const rawRows = [...table.querySelectorAll('tbody tr')].filter(
    r => r.dataset.range
  );

  const rows = rawRows.map(r => {
    const [start, end] = r.dataset.range.split('-');
    const startMinutes = parseHMToMinutes(start);
    const endMinutes = parseHMToMinutes(end);
    const [eh, em] = end.split(':').map(Number);
    return {
      tr: r,
      startMinutes,
      endMinutes,
      endHour: eh,
      endMinute: em,
      remainCell: r.querySelector('.remain')
    };
  });

  function tick(now, showAll) {
    const minutesNow = now.getHours() * 60 + now.getMinutes();

    rows.forEach(row => {
      const { tr, startMinutes, endMinutes, endHour, endMinute, remainCell } =
        row;

      tr.classList.remove('now', 'past');

      // compute ms left to end of this row
      const endDate = new Date(now);
      endDate.setHours(endHour, endMinute, 0, 0);
      const msLeft = endDate - now;
      const text = fmtMS(msLeft);

      if (remainCell) {
        if (showAll) {
          // show for all rows
          remainCell.textContent = text;
        } else {
          // only for current
          if (minutesNow >= startMinutes && minutesNow < endMinutes) {
            remainCell.textContent = text;
          } else {
            remainCell.textContent = '';
          }
        }
      }

      if (minutesNow >= endMinutes) {
        tr.classList.add('past');
      } else if (minutesNow >= startMinutes && minutesNow < endMinutes) {
        tr.classList.add('now');
      }
    });
  }

  return { tick };
}

/* === Make "Laikas" & "Liko" headers clickable to toggle mode === */
function enableHeaderToggle(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const headRows =
    table.tHead?.querySelectorAll('tr') ||
    table.querySelectorAll('thead tr');
  if (!headRows.length) return;

  // last header row contains "Pamoka | Laikas | Liko"
  const labelRow = headRows[headRows.length - 1];
  const ths = labelRow.querySelectorAll('th');
  if (ths.length < 3) return;

  const laikasTh = ths[1]; // 2nd col
  const likoTh = ths[2];   // 3rd col

  [laikasTh, likoTh].forEach(th => {
    th.style.cursor = 'pointer';
    th.style.userSelect = 'none';
    th.classList.add('laikas-toggle');

    th.addEventListener('click', () => {
      tableModes[tableId] = !tableModes[tableId];
      laikasTh.classList.toggle('active', tableModes[tableId]);
      likoTh.classList.toggle('active', tableModes[tableId]);
    });
  });
}


/* ===== Wire up both tables ===== */
let standardTable, practicalTable;

const TICK_INTERVAL = 100; // ms – 10fps is enough

function masterTick() {
  const now = getNow();
  updateLiveClock(now);
  if (standardTable) standardTable.tick(now, tableModes.timetable);
  if (practicalTable) practicalTable.tick(now, tableModes.praktinis);
}

document.addEventListener('DOMContentLoaded', () => {
  // Build tables from JS data
  buildStandardTable();
  buildPraktinisTable();

  // Enhance tables (timers / highlighting)
  standardTable = enhanceTable('timetable');
  practicalTable = enhanceTable('praktinis');

  // Make "Laikas" headers clickable toggles
  enableHeaderToggle('timetable');
  enableHeaderToggle('praktinis');

  // Load cards under each table
  loadCards();

  masterTick();
  setInterval(masterTick, TICK_INTERVAL);
});

/* Optional: hide preloader if you added one */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.add('preloader-done');
  }, 400);
});
