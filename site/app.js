// Awesome Heliophysics: search, filters, sorting, copy actions and the coronal-loop hero.
// The list is pre-rendered in the HTML; this script re-renders it from data/entries.json so it
// can filter and sort, and keeps the view in the URL (?q=, ?s=, ?sort=) for sharing.

(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- theme ----------
  const root = document.documentElement;
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;
  $('.theme').addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('ah-theme', root.dataset.theme); } catch (e) { /* storage unavailable */ }
    corona.restyle();
  });

  // ---------- toast and copy ----------
  const toast = $('#toast');
  let toastTimer;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); say(msg); } catch (e) { say('Copying is blocked in this browser.'); }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]');
    if (b) copy(b.dataset.copy, 'Badge Markdown copied.');
  });

  // ---------- list ----------
  const state = { q: '', sections: new Set(), sort: 'az' };
  let data = null;
  const listEl = $('#list');
  const chipsEl = $('#chips');
  const qEl = $('#q');
  const sortEl = $('#sort');
  const statusEl = $('#status');
  const emptyEl = $('#empty');

  const ICON_MD = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="3.5" width="13" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4 10V6l1.6 2L7.2 6v4M10.5 6v4m-1.5-1.5 1.5 1.5 1.5-1.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_LINK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 9.5a3 3 0 0 0 4.2 0l2.1-2.1a3 3 0 0 0-4.2-4.2l-.8.8M9.5 6.5a3 3 0 0 0-4.2 0L3.2 8.6a3 3 0 0 0 4.2 4.2l.8-.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';

  function readURL() {
    const p = new URLSearchParams(location.search);
    state.q = p.get('q') || '';
    state.sections = new Set((p.get('s') || '').split(',').filter(Boolean));
    state.sort = ['az', 'stars', 'recent'].includes(p.get('sort')) ? p.get('sort') : 'az';
    qEl.value = state.q;
    sortEl.value = state.sort;
  }
  function writeURL() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.sections.size) p.set('s', [...state.sections].join(','));
    if (state.sort !== 'az') p.set('sort', state.sort);
    const qs = p.toString();
    history.replaceState(null, '', (qs ? `?${qs}` : location.pathname) + location.hash);
  }

  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  function haystack(e) {
    const g = e.github || {};
    return norm([e.name, e.desc, e.host, e.section, g.language || '', (g.topics || []).join(' ')].join(' '));
  }
  function highlight(text, terms) {
    if (!terms.length) return esc(text);
    const n = norm(text);
    const marks = [];
    for (const t of terms) {
      let i = n.indexOf(t);
      while (i !== -1) { marks.push([i, i + t.length]); i = n.indexOf(t, i + t.length); }
    }
    if (!marks.length) return esc(text);
    marks.sort((a, b) => a[0] - b[0]);
    let out = '';
    let pos = 0;
    for (const [a, b] of marks) {
      if (a < pos) continue;
      out += esc(text.slice(pos, a)) + '<mark>' + esc(text.slice(a, b)) + '</mark>';
      pos = b;
    }
    return out + esc(text.slice(pos));
  }

  function entryHTML(e, terms) {
    const g = e.github || {};
    const meta = [];
    if (g.stars != null) meta.push(`<span class="m-stars" title="GitHub stars">${g.stars.toLocaleString('en')}</span>`);
    if (g.language) meta.push(`<span class="m-lang">${esc(g.language)}</span>`);
    if (g.pushed) meta.push(`<span class="m-pushed" title="Last push to the repository">Updated ${esc(fmtDate(g.pushed))}</span>`);
    if (g.archived) meta.push('<span class="m-archived">Archived</span>');
    return `<li class="entry" id="${esc(e.id)}">
      <a class="e-name" href="${esc(e.url)}" rel="noopener">${highlight(e.name, terms)}</a>
      <span class="e-host">${highlight(e.host, terms)}</span>
      <div class="e-actions">
        <button class="icon-btn" type="button" data-md="${esc(e.id)}" aria-label="Copy the Markdown entry for ${esc(e.name)}" title="Copy as Markdown">${ICON_MD}</button>
        <button class="icon-btn" type="button" data-link="${esc(e.id)}" aria-label="Copy a link to ${esc(e.name)} on this page" title="Copy a link to this entry">${ICON_LINK}</button>
      </div>
      <p class="e-desc">${highlight(e.desc, terms)}</p>
      <div class="e-meta">${meta.join('')}</div>
    </li>`;
  }
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(iso) { const [y, m] = iso.split('-'); return `${MONTHS[+m - 1]} ${y}`; }

  function sorter(a, b) {
    if (state.sort === 'stars') return ((b.github || {}).stars ?? -1) - ((a.github || {}).stars ?? -1) || a.name.localeCompare(b.name);
    if (state.sort === 'recent') return ((b.github || {}).pushed || '').localeCompare((a.github || {}).pushed || '') || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
  }

  function render() {
    const terms = norm(state.q).split(/\s+/).filter(Boolean);
    const shown = data.entries.filter((e) =>
      (!state.sections.size || state.sections.has(e.sectionId)) && terms.every((t) => e.hay.includes(t)));
    const html = data.sections.map((s) => {
      const items = shown.filter((e) => e.sectionId === s.id).sort(sorter);
      if (!items.length) return '';
      return `<section class="group" id="${s.id}" style="--c:${s.color}">
        <h2 class="g-title"><span>${esc(s.name)}</span><span class="g-channel" title="Colour of the AIA ${esc(s.channel)} channel">${esc(s.channel)}</span><span class="g-count">${items.length === s.count ? s.count : `${items.length} of ${s.count}`}</span></h2>
        <ul class="entries">${items.map((e) => entryHTML(e, terms)).join('')}</ul></section>`;
    }).join('');
    listEl.querySelectorAll('.group').forEach((g) => g.remove());
    emptyEl.insertAdjacentHTML('beforebegin', html);
    emptyEl.hidden = shown.length > 0;
    const total = data.entries.length;
    statusEl.textContent = shown.length === total ? `All ${total} resources.`
      : `Showing ${shown.length} of ${total} resources${state.q ? ` matching “${state.q}”` : ''}.`;
    chipsEl.querySelectorAll('.chip').forEach((c) => {
      c.setAttribute('aria-pressed', c.dataset.s ? String(state.sections.has(c.dataset.s)) : String(!state.sections.size));
    });
    writeURL();
  }

  function buildChips() {
    const all = `<button class="chip chip-all" type="button" data-s="" aria-pressed="true">All <span class="n">${data.entries.length}</span></button>`;
    chipsEl.innerHTML = all + data.sections.map((s) =>
      `<button class="chip" type="button" data-s="${s.id}" style="--c:${s.color}" aria-pressed="false" title="Colour of the AIA ${esc(s.channel)} channel">${esc(s.name)} <span class="n">${s.count}</span></button>`).join('');
    chipsEl.addEventListener('click', (e) => {
      const c = e.target.closest('.chip');
      if (!c) return;
      const id = c.dataset.s;
      if (!id) state.sections.clear();
      else if (e.metaKey || e.ctrlKey || e.shiftKey) { state.sections.has(id) ? state.sections.delete(id) : state.sections.add(id); }
      else if (state.sections.size === 1 && state.sections.has(id)) state.sections.clear();
      else state.sections = new Set([id]);
      render();
    });
  }

  function flash(el) {
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }
  function goTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    flash(el);
    el.querySelector('.e-name').focus({ preventScroll: true });
  }

  listEl.addEventListener('click', (e) => {
    const md = e.target.closest('[data-md]');
    const ln = e.target.closest('[data-link]');
    if (md) {
      const x = data.byId[md.dataset.md];
      copy(`- [${x.name}](${x.url}) - ${x.desc}`, `Markdown for ${x.name} copied.`);
    } else if (ln) {
      const x = data.byId[ln.dataset.link];
      copy(`${location.origin}${location.pathname}#${x.id}`, `Link to ${x.name} copied.`);
    }
  });

  let qTimer;
  qEl.addEventListener('input', () => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => {
      state.q = qEl.value.trim();
      render();
      if (state.q && typeof gtag === 'function') gtag('event', 'search', { search_term: state.q });
    }, 120);
  });
  sortEl.addEventListener('change', () => { state.sort = sortEl.value; render(); });
  $('#clear').addEventListener('click', () => { qEl.value = ''; state.q = ''; state.sections.clear(); render(); qEl.focus(); });
  $('#random').addEventListener('click', () => {
    const vis = [...listEl.querySelectorAll('.entry')];
    if (vis.length) goTo(vis[Math.floor(Math.random() * vis.length)].id);
  });
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); qEl.focus(); qEl.select(); }
    else if (e.key === 'Escape' && document.activeElement === qEl && qEl.value) { qEl.value = ''; state.q = ''; render(); }
  });

  fetch('data/entries.json').then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then((d) => {
    data = d;
    data.byId = {};
    const ids = Object.fromEntries(d.sections.map((s) => [s.name, s.id]));
    for (const e of d.entries) { e.sectionId = ids[e.section]; e.hay = haystack(e); data.byId[e.id] = e; }
    buildChips();
    readURL();
    render();
    if (location.hash.length > 1) requestAnimationFrame(() => goTo(decodeURIComponent(location.hash.slice(1))));
  }).catch(() => { statusEl.textContent = 'Search is unavailable right now; the full list is below.'; });

  // ---------- hero: coronal loops over the limb ----------
  // ---------- surface flux transport on the disc (idealised, northern hemisphere) ----------
  // Bipolar regions emerge in the activity belt: latitude drifting equatorward over each cycle
  // (Spörer), leading polarity alternating each cycle (Hale), the pair separating and tilting so the
  // trailing polarity lies poleward (Joy). Flux elements drift with a slowly varying random velocity
  // (supergranular diffusion), are sheared by differential rotation and carried poleward by the
  // meridional flow. Leading flux mostly cancels (in reality, across the equator with the other
  // hemisphere's); trailing flux reaches the pole, cancels the old polar field and builds the new one.
  function makeFlux(seed) {
    const DEG = Math.PI / 180;
    const CYCLE = 80;           // seconds per sunspot cycle on the page
    const MAX = 1500;           // flux elements kept at most
    const TAU = 3;              // velocity correlation time (s)
    const D = 1.0;              // diffusion (deg^2/s) = SV^2 * TAU
    const SV = Math.sqrt(D / TAU);
    const GROW = 3.2;           // emergence: flux grows in and the polarities separate (s)
    const FADE = 1.6;           // cancelled or decayed flux fades out (s)
    let s0 = seed;
    const rnd = () => ((s0 = (s0 * 16807) % 2147483647) - 1) / 2147483646;
    const gauss = () => { let u = 0; for (let i = 0; i < 6; i++) u += rnd(); return (u - 3) * 1.414; };
    let els = [], t = 0, nextRegion = 0;
    const lead = (k) => (k % 2 === 0 ? 1 : -1);      // northern leading polarity of cycle k
    const ease = (x) => (x >= 1 ? 1 : x * x * (3 - 2 * x));

    function add(lat, lon, s, kind, sLat, sLon, age) {
      els.push({ lat, lon, s, kind, age, die: 0, vl: gauss() * SV, vo: gauss() * SV, sLat, sLon, w: 0 });
    }
    function emerge(phase, k) {
      const lat0 = 32 - 24 * phase + gauss() * 3;
      const lon0 = rnd() * 360 - 180;
      const sep = 6 + rnd() * 6;                     // final separation of the polarities (deg)
      const tilt = 0.5 * lat0 * DEG;                 // Joy's law
      const n = 12 + Math.floor(rnd() * 12);
      const L = lead(k);
      const dLat = Math.sin(tilt) * sep / 2;
      const dLon = Math.cos(tilt) * sep / 2 / Math.cos(lat0 * DEG);
      for (let i = 0; i < n; i++) {
        // Both polarities start at the centre and move apart while the flux grows in
        add(lat0 + gauss() * 0.4, lon0 + gauss() * 0.5, L, 'lead', (-dLat + gauss() * 0.5) / GROW, (dLon + gauss() * 0.7) / GROW, 0);
        add(lat0 + gauss() * 0.4, lon0 + gauss() * 0.5, -L, 'trail', (dLat + gauss() * 0.6) / GROW, (-dLon + gauss() * 0.9) / GROW, 0);
      }
    }
    function init() {
      els = [];
      // The polar field left by the previous cycle has the sign of this cycle's leading polarity
      for (let i = 0; i < 200; i++) {
        const lat = Math.asin(Math.sin(58 * DEG) + rnd() * (1 - Math.sin(58 * DEG))) / DEG;
        add(lat, rnd() * 360 - 180, lead(0), 'polar', 0, 0, 99);
      }
      t = CYCLE * 0.1;
      for (let i = 0; i < 30 * 30; i++) step(1 / 30);   // start from an evolved disc
    }
    function step(dt) {
      t += dt;
      const k = Math.floor(t / CYCLE);
      const phase = (t / CYCLE) % 1;
      const rate = 0.1 + 0.95 * Math.pow(Math.sin(Math.PI * phase), 1.6);
      nextRegion -= dt * rate;
      if (nextRegion <= 0 && els.length < MAX) { emerge(phase, k); nextRegion = 0.7 + rnd() * 0.9; }
      const kick = SV * Math.sqrt(2 * dt / TAU);
      for (const e of els) {
        e.age += dt;
        // Slowly varying random velocity: smooth drift with the same diffusion as a random walk
        e.vl += -e.vl / TAU * dt + kick * gauss();
        e.vo += -e.vo / TAU * dt + kick * gauss();
        const growing = e.age < GROW;
        const vm = 1.8 * Math.sin(2 * e.lat * DEG);      // meridional flow, poleward (deg/s)
        e.lat += (vm + e.vl + (growing ? e.sLat : 0)) * dt;
        const cl = Math.max(0.15, Math.cos(e.lat * DEG));
        e.lon += (2.4 - 2.0 * Math.pow(Math.sin(e.lat * DEG), 2) + e.vo / cl + (growing ? e.sLon : 0)) * dt;
        if (e.lat > 89.5) { e.lat = 179 - e.lat; e.lon += 180; }
        if (e.lon > 180) e.lon -= 360; else if (e.lon < -180) e.lon += 360;
        if (e.die) e.die += dt;
        else {
          const r = e.kind === 'lead' ? 0.06 : (e.lat > 62 ? 0.015 : 0.01);
          if (e.lat < 3 || rnd() < r * dt) e.die = 1e-6;
        }
        e.w = ease(Math.min(1, e.age / GROW)) * (e.die ? Math.max(0, 1 - e.die / FADE) : 1);
        if (e.kind === 'trail' && e.lat > 62) e.kind = 'polar';
      }
      // Opposite polarities that meet cancel (and then fade out)
      const grid = new Map();
      for (const e of els) {
        if (e.die || e.age < GROW) continue;
        const key = `${Math.round(e.lat / 1.4)},${Math.round(e.lon * Math.cos(e.lat * DEG) / 1.4)}`;
        const o = grid.get(key);
        if (o && o.s !== e.s) { o.die = e.die = 1e-6; grid.delete(key); } else if (!o) grid.set(key, e);
      }
      els = els.filter((e) => e.die < FADE);
    }
    return { init, step, get els() { return els; }, get phase() { return (t / CYCLE) % 1; } };
  }

  const corona = (() => {
    const cv = $('.corona');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1, loops = [], sun = null, running = false, raf = 0, t0 = performance.now();
    let lean = 0, leanTarget = 0;
    let colors = {};
    const flux = makeFlux(1755);
    flux.init();
    const B0 = -4 * Math.PI / 180;   // viewer slightly south, so the activity belt sits higher
    let lastNow = 0;
    let field = null;

    // The flux is summed onto a fine screen grid as a signed field (so mixed polarities cancel),
    // coloured like a magnetogram and drawn with smooth interpolation
    function setupField() {
      const cell = Math.max(4, Math.round(sun.R * 0.008));
      const x0 = Math.max(0, Math.floor(sun.x - sun.R)), y0 = Math.max(0, Math.floor(sun.y - sun.R));
      const x1 = Math.min(W, Math.ceil(sun.x + sun.R)), y1 = Math.min(H, Math.ceil(sun.y + sun.R));
      const gx = Math.max(2, Math.ceil((x1 - x0) / cell) + 1), gy = Math.max(2, Math.ceil((y1 - y0) / cell) + 1);
      const c = document.createElement('canvas');
      c.width = gx; c.height = gy;
      const fx = c.getContext('2d');
      field = { cell, x0, y0, gx, gy, c, fx, img: fx.createImageData(gx, gy), v: new Float32Array(gx * gy),
                sig: (sun.R * 0.0145) / cell };
    }
    function drawFlux() {
      const F = field;
      if (!F) return;
      const v = F.v;
      v.fill(0);
      const cb = Math.cos(B0), sb = Math.sin(B0);
      const inv = 1 / (2 * F.sig * F.sig);
      const rad = Math.ceil(F.sig * 2.6);
      for (const e of flux.els) {
        if (e.w <= 0.01) continue;
        const la = e.lat * Math.PI / 180, lo = e.lon * Math.PI / 180;
        const cl = Math.cos(la);
        const z = Math.sin(la) * sb + cl * Math.cos(lo) * cb;   // towards the viewer
        if (z <= 0.01) continue;
        const y = Math.sin(la) * cb - cl * Math.cos(lo) * sb;
        const gxp = (sun.x + sun.R * cl * Math.sin(lo) - F.x0) / F.cell - 0.5;
        const gyp = (sun.y - sun.R * y - F.y0) / F.cell - 0.5;
        if (gxp < -rad || gyp < -rad || gxp > F.gx + rad || gyp > F.gy + rad) continue;
        const amp = e.s * e.w * (0.35 + 0.65 * Math.sqrt(z));
        const ix = Math.round(gxp), iy = Math.round(gyp);
        for (let j = Math.max(0, iy - rad); j <= Math.min(F.gy - 1, iy + rad); j++) {
          const dy = j - gyp;
          for (let i = Math.max(0, ix - rad); i <= Math.min(F.gx - 1, ix + rad); i++) {
            const dx = i - gxp;
            v[j * F.gx + i] += amp * Math.exp(-(dx * dx + dy * dy) * inv);
          }
        }
      }
      const d = F.img.data;
      const P = colors.dark ? [255, 240, 205, 0.88] : [255, 252, 240, 0.95];
      const N = colors.dark ? [4, 6, 22, 0.82] : [74, 38, 8, 0.7];
      for (let i = 0, n = v.length; i < n; i++) {
        const x = v[i];
        const m = Math.min(1, Math.abs(x) / 3.6);
        const C = x >= 0 ? P : N;
        const k = i * 4;
        d[k] = C[0]; d[k + 1] = C[1]; d[k + 2] = C[2];
        d[k + 3] = 255 * C[3] * Math.pow(m, 0.8);
      }
      F.fx.putImageData(F.img, 0, 0);
      ctx.save();
      ctx.beginPath(); ctx.arc(sun.x, sun.y, sun.R * 0.997, 0, Math.PI * 2); ctx.clip();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(F.c, F.x0, F.y0, F.gx * F.cell, F.gy * F.cell);
      ctx.restore();
    }
    function restyle() {
      const cs = getComputedStyle(root);
      colors = { gold: cs.getPropertyValue('--gold').trim(), limb: cs.getPropertyValue('--limb').trim(), dark: isDark() };
      if (reduced || !running) draw(performance.now());
    }
    function rand(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }
    function layout() {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const narrow = W < 760;
      const R = narrow ? W * 1.1 : Math.max(W * 0.4, H * 0.85);
      // The disc sits on the right, low enough to leave the text clear and high enough to show the
      // activity belt rising towards the pole (seen from 4 degrees south of the equator)
      sun = narrow ? { x: W * 0.6, y: H + R * 0.5, R } : { x: W * 0.9, y: H + R * 0.1, R };
      setupField();
      const rnd = rand(171);
      loops = [];
      // Active regions on the visible limb: each is an arcade of nested loops of similar shape
      const regions = narrow ? [-0.42, -0.12, 0.2] : [-0.62, -0.38, -0.16, 0.04];
      for (const rc of regions) {
        const size = 0.08 + rnd() * 0.08;      // half-width of the region's largest loop (rad)
        const tilt = (rnd() - 0.5) * 0.5;
        const m = 7 + Math.floor(rnd() * 7);
        for (let j = 0; j < m; j++) {
          const f = 0.25 + 0.75 * (j + 1) / m;
          const span = size * f;
          const c = rc + (rnd() - 0.5) * size * 0.35;
          const height = sun.R * span * (0.85 + rnd() * 0.6);
          loops.push({ c, span, height, tilt, w: 0.6 + f * 1.6, a: 0.25 + rnd() * 0.45, ph: rnd() * Math.PI * 2, sp: 0.25 + rnd() * 0.6, dash: 18 + rnd() * 60 });
        }
      }
      // A few long, faint loops connecting regions
      for (let k = 0; k < 5; k++) {
        const a = regions[Math.floor(rnd() * regions.length)];
        const span = 0.12 + rnd() * 0.1;
        loops.push({ c: a + 0.1 + rnd() * 0.1, span, height: sun.R * span * (0.7 + rnd() * 0.4), tilt: 0, w: 0.7, a: 0.16, ph: rnd() * 6, sp: 0.2, dash: 70 });
      }
    }
    function point(L, s, leanNow) {
      // s in [0, 1] from one footpoint to the other; the loop rises radially above the limb
      const ang = -Math.PI / 2 + L.c + (s - 0.5) * 2 * L.span;
      const rise = Math.sin(Math.PI * s);
      const r = sun.R + L.height * Math.pow(rise, 0.85);
      const a2 = ang + (leanNow + L.tilt) * rise * rise * (L.height / sun.R) * 1.4;
      return [sun.x + r * Math.cos(a2), sun.y + r * Math.sin(a2)];
    }
    function draw(now) {
      const t = (now - t0) / 1000;
      lean += (leanTarget - lean) * 0.04;
      ctx.clearRect(0, 0, W, H);
      // limb glow and disc
      const g = ctx.createRadialGradient(sun.x, sun.y, sun.R * 0.96, sun.x, sun.y, sun.R * 1.22);
      g.addColorStop(0, colors.dark ? 'rgba(233,180,76,0.38)' : 'rgba(185,126,16,0.28)');
      g.addColorStop(1, 'rgba(233,180,76,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(sun.x, sun.y, sun.R * 1.22, 0, Math.PI * 2); ctx.fill();
      // Disc darker at centre and brighter towards the limb, as in EUV images
      const disc = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, sun.R);
      if (colors.dark) {
        disc.addColorStop(0, '#1E1007'); disc.addColorStop(0.82, '#3A1E0B'); disc.addColorStop(0.97, '#6E3D12'); disc.addColorStop(1, '#9A5A1A');
      } else {
        disc.addColorStop(0, '#E3BE72'); disc.addColorStop(0.85, '#D9AE58'); disc.addColorStop(1, '#C8963A');
      }
      ctx.fillStyle = disc;
      ctx.beginPath(); ctx.arc(sun.x, sun.y, sun.R, 0, Math.PI * 2); ctx.fill();
      drawFlux();
      ctx.strokeStyle = colors.gold; ctx.globalAlpha = 0.6; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(sun.x, sun.y, sun.R, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = colors.dark ? 'lighter' : 'source-over';
      ctx.lineCap = 'round';
      for (const L of loops) {
        const pulse = reduced ? 1 : 0.65 + 0.35 * Math.sin(t * L.sp + L.ph);
        ctx.beginPath();
        for (let k = 0; k <= 40; k++) {
          const [x, y] = point(L, k / 40, lean);
          if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.strokeStyle = colors.gold;
        ctx.globalAlpha = L.a * pulse * (colors.dark ? 0.75 : 0.8);
        ctx.lineWidth = L.w;
        ctx.setLineDash([]);
        ctx.stroke();
        if (!reduced) {
          // Plasma moving along the loop
          ctx.globalAlpha = L.a * 0.9 * (colors.dark ? 1 : 0.7);
          ctx.lineWidth = L.w + 0.6;
          ctx.setLineDash([2 + L.w * 2, L.dash]);
          ctx.lineDashOffset = -t * 18 * L.sp;
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    function loop(now) {
      const dt = lastNow ? Math.min(0.05, (now - lastNow) / 1000) : 0;
      lastNow = now;
      if (dt) flux.step(dt);
      draw(now);
      raf = requestAnimationFrame(loop);
    }
    function start() { if (!running && !reduced) { running = true; raf = requestAnimationFrame(loop); } }
    function stop() { running = false; lastNow = 0; cancelAnimationFrame(raf); }

    layout(); restyle(); draw(performance.now());
    new ResizeObserver(() => { layout(); draw(performance.now()); }).observe(cv);
    new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop())).observe(cv);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    window.addEventListener('pointermove', (e) => { leanTarget = ((e.clientX / window.innerWidth) - 0.5) * 0.9; }, { passive: true });
    matchMedia('(prefers-color-scheme: light)').addEventListener('change', restyle);
    return { restyle };
  })();
})();
