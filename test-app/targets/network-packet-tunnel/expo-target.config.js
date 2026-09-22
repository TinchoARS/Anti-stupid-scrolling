/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = config => ({
  type: "network-packet-tunnel",
  name: "nevpntest",
  bundleIdentifier: ".nevpntest",
  entitlements: {
    "com.apple.developer.networking.networkextension": ["packet-tunnel-provider"],
  },
});