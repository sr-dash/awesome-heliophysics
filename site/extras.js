// Two small helpers shared in spirit with HelioFleet's pages:
// - a "back to top" button that appears once the reader is a screen down and returns focus to the
//   page heading, so keyboard and screen-reader users land where sighted readers do;
// - a one-time card for first visits. After the page has been in view for 10 seconds it suggests
//   bookmarking (browsers do not let a page bookmark itself, so it shows the keyboard shortcut, or
//   the home-screen route on touch devices), installing the page as an app where the browser offers
//   that, and starring the repository. It appears once per browser, never in a frame or in the
//   installed app, does not take focus, and closes with Escape.

(() => {
  'use strict';
  const REPO = 'https://github.com/sr-dash/awesome-heliophysics';
  const KEY = 'ah-nudge';
  const DELAY_MS = 10000;
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const track = (name, params) => { if (typeof window.gtag === 'function') window.gtag('event', name, params); };
  const el = (tag, props = {}, kids = []) => {
    const e = Object.assign(document.createElement(tag), props);
    for (const k of [].concat(kids)) e.append(k);
    return e;
  };

  // ---------- back to top ----------
  const top = el('button', { type: 'button', className: 'to-top', title: 'Back to top' });
  top.setAttribute('aria-label', 'Back to top');
  top.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>';
  document.body.append(top);
  const update = () => top.classList.toggle('on', document.documentElement.scrollHeight > innerHeight * 1.8 && scrollY > innerHeight * 0.9);
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
  top.addEventListener('click', () => {
    scrollTo({ top: 0, behavior: reduce() ? 'auto' : 'smooth' });
    const h = document.querySelector('h1');
    if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  });

  // ---------- share palette ----------
  // Plain share links (nothing loads from the networks until someone clicks), the link copied to the
  // clipboard, and the device's own share sheet where the browser has one. The shared address is
  // the current view, so a search or section filter travels with it.
  const TEXT = 'Awesome Heliophysics: a curated, searchable list of data archives, software, models and services for the Sun, the heliosphere and space weather.';
  const MASTO_KEY = 'ah-mastodon';
  const ICONS = {
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4l-1.1 1.1M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.1-1.1"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
    bluesky: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.2 2.86C7.95 4.92 10.91 9.11 12 11.36c1.09-2.25 4.05-6.44 6.8-8.5C20.78 1.37 24 .21 24 3.88c0 .73-.42 6.16-.67 7.04-.86 3.06-3.98 3.84-6.76 3.37 4.86.83 6.09 3.56 3.42 6.3-5.06 5.2-7.28-1.3-7.84-2.97-.11-.31-.16-.45-.15-.33 0-.12-.05.02-.15.33-.57 1.67-2.78 8.17-7.85 2.97-2.67-2.74-1.43-5.47 3.42-6.3-2.77.47-5.9-.31-6.75-3.37C.42 10.04 0 4.62 0 3.88c0-3.67 3.22-2.51 5.2-1.02"/></svg>',
    mastodon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M21 9.5C21 5 17.9 3 12 3S3 5 3 9.5c0 5.6.6 9 6.4 10 2.4.4 5.1.2 6.7-.6v-2s-2.1.7-4.4.6c-2.2-.1-3.4-.6-3.6-2.6 2.6.6 5.3.7 7.7.4 3.3-.4 5.2-2.3 5.2-5.8z"/><path d="M7.5 13V9.2a1.9 1.9 0 0 1 3.8 0V11m0 0V9.2a1.9 1.9 0 0 1 3.8 0V13"/></svg>',
    reddit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><ellipse cx="12" cy="14.5" rx="8" ry="5.6"/><circle cx="18.6" cy="5.2" r="1.7"/><path d="M12 8.9 13.2 4l5 1.1"/><circle cx="9" cy="13.6" r=".9" fill="currentColor"/><circle cx="15" cy="13.6" r=".9" fill="currentColor"/><path d="M9.3 16.6c1.6 1 3.8 1 5.4 0"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.1 23.7v-7.98H6.63v-3.67H9.1v-1.58c0-4.09 1.85-5.98 5.86-5.98.4 0 .96.04 1.47.1.38.04.76.11 1.14.2v3.32a8.6 8.6 0 0 0-1.39-.05c-.7 0-1.26.1-1.67.31-.29.15-.52.36-.68.62-.26.42-.37 1-.37 1.75v1.3h3.92l-.67 3.67H14.5v8.24C19.4 23.24 24 18.18 24 12.04c0-6.63-5.37-12-12-12S0 5.41 0 12.04c0 5.63 3.87 10.35 9.1 11.65"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"><path d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.3z"/><path d="M9 8.3c-.4.9-.2 2.3 1.3 3.9 1.6 1.6 3.1 2 4 1.6l.8-1.2-1.7-.9-.8.8c-.8-.3-1.8-1.3-2.1-2.1l.8-.8-.9-1.7z" fill="currentColor" stroke-width="1"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>',
  };
  const url = () => location.origin + location.pathname + location.search;
  const enc = encodeURIComponent;
  const TARGETS = [
    { id: 'copy', label: 'Copy link' },
    { id: 'x', label: 'X', href: () => `https://twitter.com/intent/tweet?text=${enc(TEXT)}&url=${enc(url())}` },
    { id: 'linkedin', label: 'LinkedIn', href: () => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url())}` },
    { id: 'bluesky', label: 'Bluesky', href: () => `https://bsky.app/intent/compose?text=${enc(`${TEXT} ${url()}`)}` },
    { id: 'mastodon', label: 'Mastodon' },
    { id: 'reddit', label: 'Reddit', href: () => `https://www.reddit.com/submit?url=${enc(url())}&title=${enc('Awesome Heliophysics: a curated list of data, software and models for the Sun and space weather')}` },
    { id: 'facebook', label: 'Facebook', href: () => `https://www.facebook.com/sharer/sharer.php?u=${enc(url())}` },
    { id: 'whatsapp', label: 'WhatsApp', href: () => `https://wa.me/?text=${enc(`${TEXT} ${url()}`)}` },
    { id: 'email', label: 'Email', href: () => `mailto:?subject=${enc('Awesome Heliophysics')}&body=${enc(`${TEXT}\n\n${url()}`)}` },
  ];
  if (navigator.share) TARGETS.push({ id: 'more', label: 'More options' });

  const say = (msg) => {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(say.timer); say.timer = setTimeout(() => t.classList.remove('show'), 1800);
  };
  const shared = (method) => track('share', { method, content_type: 'page', item_id: location.search || '/' });
  const openShare = (href, method) => {
    window.open(href, '_blank', 'noopener,width=640,height=640');
    shared(method);
  };
  async function nativeShare() {
    try { await navigator.share({ title: 'Awesome Heliophysics', text: TEXT, url: url() }); shared('native'); }
    catch (e) { /* the reader closed the share sheet */ }
  }

  function mastodon(row) {
    let host = '';
    try { host = localStorage.getItem(MASTO_KEY) || ''; } catch (e) { /* storage unavailable */ }
    const go = (h) => {
      const clean = h.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(clean)) { say('Enter a server name such as mastodon.social.'); return false; }
      try { localStorage.setItem(MASTO_KEY, clean); } catch (e) { /* storage unavailable */ }
      openShare(`https://${clean}/share?text=${enc(`${TEXT} ${url()}`)}`, 'mastodon');
      return true;
    };
    let form = row.parentElement.querySelector('.share-masto');
    if (form) { form.remove(); return; }
    form = el('form', { className: 'share-masto' });
    const id = `masto-${Math.random().toString(36).slice(2, 7)}`;
    const input = el('input', { id, type: 'text', inputMode: 'url', placeholder: 'mastodon.social', value: host, autocomplete: 'off', spellcheck: false });
    form.append(el('label', { htmlFor: id, textContent: 'Your Mastodon server' }),
      el('div', { className: 'share-masto-row' }, [input, el('button', { type: 'submit', className: 'btn btn-small btn-primary', textContent: 'Share' })]));
    form.addEventListener('submit', (e) => { e.preventDefault(); if (go(input.value)) form.remove(); });
    row.after(form);
    input.focus();
  }

  function buildRow(row) {
    for (const t of TARGETS) {
      const b = el(t.href ? 'a' : 'button', { className: `share-btn share-${t.id}`, title: t.label });
      if (t.href) { b.href = '#'; b.rel = 'noopener'; } else b.type = 'button';
      b.setAttribute('aria-label', t.id === 'copy' ? 'Copy the link to this page' : t.id === 'more' ? 'More ways to share' : `Share on ${t.label}`);
      b.innerHTML = ICONS[t.id] + `<span>${t.label}</span>`;
      b.querySelector('svg').setAttribute('aria-hidden', 'true');
      b.addEventListener('click', async (e) => {
        e.preventDefault();
        if (t.id === 'copy') {
          try { await navigator.clipboard.writeText(url()); say('Link copied.'); shared('copy'); } catch (err) { say('Copying is blocked in this browser.'); }
        } else if (t.id === 'more') nativeShare();
        else if (t.id === 'mastodon') mastodon(row);
        else if (t.id === 'email') { location.href = t.href(); shared('email'); }
        else openShare(t.href(), t.id);
      });
      row.append(b);
    }
  }
  document.querySelectorAll('[data-share-row]').forEach(buildRow);

  const pop = document.getElementById('share-pop');
  const opener = document.querySelector('.share-open');
  if (pop && opener) {
    const close = (refocus) => {
      pop.hidden = true;
      opener.setAttribute('aria-expanded', 'false');
      pop.querySelector('.share-masto')?.remove();
      if (refocus) opener.focus();
    };
    const place = () => {
      const r = opener.getBoundingClientRect();
      pop.style.top = `${r.bottom + 10 + scrollY}px`;
      pop.style.right = `${Math.max(16, innerWidth - r.right)}px`;
    };
    opener.addEventListener('click', () => {
      // On phones the device's share sheet is the natural place to share
      if (navigator.share && matchMedia('(pointer: coarse)').matches) { nativeShare(); return; }
      if (!pop.hidden) { close(true); return; }
      place();
      pop.hidden = false;
      opener.setAttribute('aria-expanded', 'true');
      pop.querySelector('.share-btn').focus();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) close(true); });
    document.addEventListener('click', (e) => { if (!pop.hidden && !pop.contains(e.target) && !opener.contains(e.target)) close(false); });
    addEventListener('resize', () => { if (!pop.hidden) place(); });
  }

  // ---------- first-visit card ----------
  const seen = () => { try { return localStorage.getItem(KEY) !== null; } catch (e) { return true; } }; // no storage: never nag
  const mark = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* storage unavailable */ } };
  let installEvent = null;

  function show() {
    if (seen() || document.querySelector('.nudge')) return;
    mark('shown');
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const touch = matchMedia('(pointer: coarse)').matches;
    const tip = el('p');
    if (touch) tip.textContent = 'Add it to your home screen from the browser menu, so it is one tap away next time.';
    else tip.append('Bookmark it with ', el('kbd', { textContent: mac ? '⌘ D' : 'Ctrl + D' }), ', so it is one click away next time.');

    const card = el('aside', { className: 'nudge' });
    card.setAttribute('aria-label', 'Find this list useful?');
    const onKey = (e) => { if (e.key === 'Escape') close('escape'); };
    function close(action) {
      track('first_visit_card', { action });
      card.classList.remove('on');
      removeEventListener('keydown', onKey);
      setTimeout(() => card.remove(), 300);
    }
    const x = el('button', { type: 'button', className: 'nudge-x', textContent: '×', title: 'Close' });
    x.setAttribute('aria-label', 'Close');
    x.onclick = () => close('close');

    const star = el('a', { className: 'btn btn-small btn-primary', href: REPO, target: '_blank', rel: 'noopener' },
      [el('span', { textContent: '☆ ', ariaHidden: 'true' }), 'Star it on GitHub']);
    star.onclick = () => { mark('starred'); close('star'); };
    const buttons = [star];
    if (installEvent) {
      const install = el('button', { type: 'button', className: 'btn btn-small', textContent: 'Install as app' });
      install.onclick = async () => {
        const ev = installEvent; installEvent = null;
        ev.prompt();
        const choice = await ev.userChoice.catch(() => ({ outcome: 'dismissed' }));
        close(choice.outcome === 'accepted' ? 'installed' : 'install_dismissed');
      };
      buttons.push(install);
    }
    const later = el('button', { type: 'button', className: 'btn btn-small', textContent: 'Not now' });
    later.onclick = () => close('later');
    buttons.push(later);

    card.append(x,
      el('p', { className: 'nudge-h', textContent: 'Find this list useful?' }),
      tip,
      el('p', { className: 'nudge-sub', textContent: 'A star helps other researchers find it, and suggestions keep it complete.' }),
      el('div', { className: 'nudge-b' }, buttons));
    document.body.append(card);
    addEventListener('keydown', onKey);
    requestAnimationFrame(() => card.classList.add('on'));
    track('first_visit_card', { action: 'shown' });
  }

  const framed = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (!seen() && !framed && !standalone) {
    // Keep the browser's install offer for the card's button (only on visits that may show the card)
    addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvent = e; });
    // Count only time the page is actually in view
    let since = document.visibilityState === 'visible' ? performance.now() : null;
    let spent = 0, timer = 0;
    const arm = () => { clearTimeout(timer); if (since !== null) timer = setTimeout(show, Math.max(0, DELAY_MS - spent)); };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') since = performance.now();
      else if (since !== null) { spent += performance.now() - since; since = null; }
      arm();
    });
    arm();
  }
})();
