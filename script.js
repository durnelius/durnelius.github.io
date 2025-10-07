/* ===== Cards from JSON ===== */
const DATA_URL = 'cards.json';

async function loadCards() {
  const grid = document.getElementById('cards');
  const notice = document.getElementById('notice');
  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error();
    data.forEach(c => grid.appendChild(createCard(c)));
  } catch {
    notice.style.display = 'block';
    notice.textContent = 'Could not load cards.json — showing sample cards.';
    [
      { title: 'Glassy Look ✨', description: 'Frosted transparency with bright outlines.', button: { text: 'View Code', href: '#' } },
      { title: 'Blue Energy 💡', description: 'Thinner outlines & boxed buttons.', button: { text: 'Try Hover', href: '#' } },
      { title: 'JSON-Powered ⚙️', description: 'Update text and links easily.', button: { text: 'Edit JSON', href: '#' } }
    ].forEach(c => grid.appendChild(createCard(c)));
  }
}

function createCard({ title, description, button }) {
  const e = document.createElement('div');
  e.className = 'card';
  e.innerHTML = `
    <h2>${title ?? 'Untitled'}</h2>
    <p>${description ?? ''}</p>
    ${button ? `<a class="btn" href="${button.href ?? '#'}" target="_blank" rel="noopener noreferrer">${button.text ?? 'Learn more'}</a>` : ''}
  `;
  return e;
}

/* ===== Canvas Snow (respects reduced motion) ===== */
(function snow() {
  const c = document.getElementById('snow-canvas');
  const ctx = c.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const flakes = [];
  const COUNT = 50;

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
    g.lineWidth = Math.max(1, size * .1);
    g.beginPath(); g.arc(0, 0, size * .1, 0, Math.PI * 2); g.fillStyle = '#e5f2ff'; g.fill();
    for (let i = 0; i < 3; i++) { g.rotate(Math.PI / 3); g.beginPath(); g.moveTo(0, -size * .4); g.lineTo(0, size * .4); g.stroke(); }
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
        dx: (Math.random() - .5) * .5 * DPR,
        dy: (.3 + Math.random()) * DPR,
        size: sp.width / DPR
      });
    }
  }

  function anim() {
    ctx.clearRect(0, 0, c.width, c.height);
    flakes.forEach(f => {
      f.x -= f.dx;
      f.y += f.dy;
      if (f.x < -f.size || f.x > c.width + f.size) { f.x = Math.random() * c.width; f.y = -20 * DPR; }
      if (f.y > c.height + 20 * DPR) { f.x = Math.random() * c.width; f.y = -20 * DPR; }
      ctx.drawImage(f.img, f.x - f.size / 2 * DPR, f.y - f.size / 2 * DPR, f.size * DPR, f.size * DPR);
    });
    requestAnimationFrame(anim);
  }

  resize(); seed(); anim();
  addEventListener('resize', () => { resize(); seed(); });
})();

/* ===== Utilities ===== */
const liveClockEl = document.getElementById('live-clock');
function parseHM(hm) { const [H, M] = hm.split(':').map(Number); return H * 60 + M; }
function fmtMS(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const msr = ms % 1000;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(msr).padStart(3,'0')}`;
}

/* Enhance any table:
   - combinedMode: fills .left inside "time – left" cell (2-column table)
   - separateMode: fills .remain cell (3-column table)
*/
function enhanceTable(tableId, mode) {
  const table = document.getElementById(tableId);
  if (!table) return { tick: () => {} };

  const rows = [...table.querySelectorAll('tbody tr')].filter(r => r.dataset.range);

  function tick() {
    const now = new Date();
    const pad = n => String(n).padStart(2,'0');
    liveClockEl.textContent =
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${String(now.getMilliseconds()).padStart(3,'0')}`;

    // reset
    rows.forEach(r => {
      r.classList.remove('now');
      if (mode === 'combined') {
        const el = r.querySelector('.left'); if (el) el.textContent = '';
      } else {
        const el = r.querySelector('.remain'); if (el) el.textContent = '';
      }
    });

    const minutesNow = now.getHours() * 60 + now.getMinutes();
    for (const r of rows) {
      const [start, end] = r.dataset.range.split('-');
      const s = parseHM(start), e = parseHM(end);
      if (minutesNow >= s && minutesNow < e) {
        r.classList.add('now');
        const [eh, em] = end.split(':').map(Number);
        const endDate = new Date(now); endDate.setHours(eh, em, 0, 0);
        const text = fmtMS(endDate - now);
        if (mode === 'combined') {
          const el = r.querySelector('.left'); if (el) el.textContent = text;
        } else {
          const el = r.querySelector('.remain'); if (el) el.textContent = text;
        }
        break;
      }
    }
  }
  return { tick };
}

/* Wire up both tables */
const standardTable = enhanceTable('timetable', 'combined');
const practicalTable = enhanceTable('praktinis', 'separate');

function masterTick() {
  standardTable.tick();
  practicalTable.tick();
}
setInterval(masterTick, 50);

document.addEventListener('DOMContentLoaded', () => {
  loadCards();
  masterTick();
});
