// ==UserScript==
// @name         Anti-Reels IG
// @namespace    https://github.com/TinchoARS/Anti-stupid-scrolling
// @version      0.2.0
// @description  Oculta Reels en Instagram web y redirige fuera de /reels/
// @match        https://www.instagram.com/*
// @match        https://instagram.com/*
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

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  // article:has hides reels in the feed; /reels/audio/ is excluded because photos with music link there too
  style.textContent = `a[href$="/reels"], a[href*="/reels/"], a[href*="/reel/"], article:has(a[href*="/reel/"], a[href^="/reels/"]:not([href^="/reels/audio/"])) { display: none !important; }`;
  (document.head || document.documentElement).appendChild(style);

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

if (typeof module !== 'undefined') module.exports = { target, decide, dmView };
