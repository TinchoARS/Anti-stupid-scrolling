const assert = require('assert');
const { target, decide, dmView } = require('./anti-reels.user.js');

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

assert.deepStrictEqual(decide('/direct/t/123/', '/reel/ABC/', null), [null, 'ABC']);
assert.deepStrictEqual(decide('/direct/t/123/', '/reels/ABC/', null), [null, 'ABC']);
assert.deepStrictEqual(decide('/reels/ABC/', '/reels/DEF/', 'ABC'), ['/', 'ABC']);
assert.deepStrictEqual(decide('/', '/reels/ABC/', null), ['/', null]);
assert.deepStrictEqual(decide('/direct/t/123/', '/direct/t/456/', null), [null, null]);

assert.strictEqual(dmView(false, '/direct/t/1/', null), true);
assert.strictEqual(dmView(true, '/p/ABC/', null), true); // reel opened from a DM as a /p/ dialog
assert.strictEqual(dmView(false, '/p/ABC/', null), false);
assert.strictEqual(dmView(true, '/reel/ABC/', null), true);
assert.strictEqual(dmView(true, '/reels/DEF/', '/'), false);
assert.strictEqual(dmView(true, '/someuser/', null), false);

console.log('ok');
