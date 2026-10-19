// ==UserScript==
// @name         Anti-Reels IG
// @namespace    https://github.com/TinchoARS/Anti-stupid-scrolling
// @version      0.1.0
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

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = 'a[href$="/reels"], a[href*="/reels/"], a[href*="/reel/"] { display: none !important; }';
  (document.head || document.documentElement).appendChild(style);

  function check() {
    const result = target(location.pathname);
    if (result) location.replace(result);
  }
  check();
  setInterval(check, 500); // ponytail: polling 500ms, swap for history.pushState hook if it costs battery
}

if (typeof module !== 'undefined') module.exports = { target };
