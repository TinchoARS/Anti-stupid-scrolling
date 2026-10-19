const assert = require('assert');
const { target } = require('./anti-reels.user.js');

assert.strictEqual(target('/reels'), '/');
assert.strictEqual(target('/reels/'), '/');
assert.strictEqual(target('/reels/anything'), '/');
assert.strictEqual(target('/reel/ABC123/'), '/');
assert.strictEqual(target('/someuser/reels/'), '/someuser/');
assert.strictEqual(target('/someuser/reels'), '/someuser/');
assert.strictEqual(target('/'), null);
assert.strictEqual(target('/someuser/'), null);
assert.strictEqual(target('/p/XYZ/'), null);
assert.strictEqual(target('/explore/'), null);
assert.strictEqual(target('/reelmaster/'), null);

console.log('ok');
