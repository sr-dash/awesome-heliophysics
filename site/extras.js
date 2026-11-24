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
