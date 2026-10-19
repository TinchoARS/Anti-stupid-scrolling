// ==UserScript==
// @name         Anti-Reels IG
// @namespace    https://github.com/TinchoARS/Anti-stupid-scrolling
// @version      0.4.0
// @description  Oculta Reels de Instagram y Shorts de YouTube, y redirige fuera de /reels/ y /shorts/
// @match        https://www.instagram.com/*
// @match        https://instagram.com/*
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-start
// @grant        none
// @updateURL    https://raw.githubusercontent.com/TinchoARS/Anti-stupid-scrolling/main/anti-reels.user.js
// @downloadURL  https://raw.githubusercontent.com/TinchoARS/Anti-stupid-scrolling/main/anti-reels.user.js
// ==/UserScript==

function target(path) {
  const reelsRoot = /^\/reels(\/|$)/;
  const reelRoot = /^\/reel\//;
  const userReels = /\/reels(\/|$)/;

  if (reelsRoot.test(path) || reelRoot.test(path)) return '/';
  if (userReels.test(path)) {
    const idx = path.lastIndexOf('/reels');
    return path.substring(0, idx) + '/';
  }
  return null;
}

// Returns [redirectTo or null, allowedReelId]. A reel opened from /direct/ is allowed; any other reel is not.
function decide(prev, path, allowed) {
  const to = target(path);
  const id = path.split('/')[2];
  if (to && prev.startsWith('/direct/')) allowed = id;
  return [to && id !== allowed ? to : null, allowed];
}

// True while in DMs or in what was opened from them (a /p/ dialog or the allowed reel); the CSS is off there.
function dmView(dm, path, to) {
  if (path.startsWith('/direct/')) return true;
  return dm && !to && (path.startsWith('/p/') || target(path) !== null);
}

function ytTarget(path) {
  const short = /^\/shorts\/([A-Za-z0-9_-]+)\/?$/.exec(path);
  if (short) return '/watch?v=' + short[1];
  if (path === '/shorts' || path === '/shorts/') return '/';
  const user = /^(\/@[^/]+|\/channel\/[^/]+)\/shorts\/?$/.exec(path);
  if (user) return user[1] + '/videos';
  return null;
}

if (typeof window !== 'undefined' && location.hostname.endsWith('youtube.com')) {
  // YouTube: hide Shorts entry points (desktop and m.youtube.com) and redirect Shorts pages
  const style = document.createElement('style');
  style.textContent = `
    ytd-guide-entry-renderer:has(a[title="Shorts"]),
    ytd-mini-guide-entry-renderer[aria-label="Shorts"],
    ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
    ytd-rich-shelf-renderer[is-shorts],
    ytd-reel-shelf-renderer,
    grid-shelf-view-model:has(ytm-shorts-lockup-view-model),
    ytd-rich-item-renderer:has(a[href^="/shorts/"]),
    ytd-video-renderer:has(a[href^="/shorts/"]),
    ytm-shorts-lockup-view-model-v2,
    ytm-shorts-lockup-view-model,
    yt-tab-shape[tab-title="Shorts"],
    /* m.youtube.com (iPhone) — not verified live yet */
    ytm-pivot-bar-item-renderer:has(.pivot-shorts),
    ytm-reel-shelf-renderer,
    ytm-rich-section-renderer:has(ytm-shorts-lockup-view-model)
  { display: none !important; }`;
  (document.head || document.documentElement).appendChild(style);

  function check() {
    const to = ytTarget(location.pathname);
    if (to) location.replace(to);
  }
  check();
  setInterval(check, 500); // YouTube is also a single-page app
} else if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  // Feed reels collapse to a 40px "Reel oculto" strip instead of display:none: zero-height posts break IG's virtualized feed (posts pile up, black screen while scrolling).
  // /reels/audio/ is excluded because photos with music link there too.
  const reel = 'article:has(a[href*="/reel/"], a[href^="/reels/"]:not([href^="/reels/audio/"]))';
  style.textContent = `a[href$="/reels"], a[href*="/reels/"], a[href*="/reel/"] { display: none !important; }
    ${reel} { max-height: 40px !important; overflow: hidden !important; position: relative !important; }
    ${reel} > * { visibility: hidden !important; }
    ${reel} video { display: none !important; }
    ${reel}::before { content: 'Reel oculto'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font: 12px system-ui; opacity: .5; }`;
  (document.head || document.documentElement).appendChild(style);

  const nav = document.createElement('style');
  // The sidebar Reels entry stays hidden even in DMs, where the other CSS is off
  nav.textContent = 'a[href="/reels/"] { display: none !important; }';
  (document.head || document.documentElement).appendChild(nav);

  // document.referrer covers a full page load coming from a DM
  let prev = document.referrer.includes('/direct/') ? '/direct/' : location.pathname;
  let allowed = null;
  let dm = prev === '/direct/';
  function check() {
    const path = location.pathname;
    let to;
    [to, allowed] = decide(prev, path, allowed);
    prev = path;
    dm = dmView(dm, path, to);
    style.disabled = dm;
    if (to) location.replace(to);
  }
  check();
  setInterval(check, 500); // ponytail: polling 500ms, swap for history.pushState hook if it costs battery
}

if (typeof module !== 'undefined') module.exports = { target, decide, dmView, ytTarget };
