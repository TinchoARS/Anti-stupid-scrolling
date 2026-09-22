const { withAppDelegate } = require("@expo/config-plugins");
const { mergeContents } = require("@expo/config-plugins/build/utils/generateCode");

// Feasibility test only: proves whether a NEPacketTunnelProvider extension
// can be signed and started under free/Sideloadly signing. Not the real
// blocking feature.
const EXTENSION_BUNDLE_ID = "com.fradejas84.antiigtest.nevpntest";

module.exports = function withVpnTest(config) {
  return withAppDelegate(config, (config) => {
    config.modResults.contents = mergeContents({
      tag: "vpntest-import",
      src: config.modResults.contents,
      newSrc: "import NetworkExtension",
      anchor: /import ReactAppDependencyProvider/,
      offset: 1,
      comment: "//",
    }).contents;

    config.modResults.contents = mergeContents({
      tag: "vpntest-helper",
      src: config.modResults.contents,
      newSrc: `
  func showVpnTestAlert(title: String, message: String) {
    DispatchQueue.main.async {
      let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
      alert.addAction(UIAlertAction(title: "OK", style: .default))
      self.window?.rootViewController?.present(alert, animated: true)
    }
  }
`,
      anchor: /var reactNativeFactory: RCTReactNativeFactory\?/,
      offset: 1,
      comment: "//",
    }).contents;

    config.modResults.contents = mergeContents({
      tag: "vpntest-trigger",
      src: config.modResults.contents,
      newSrc: `
    DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
      let manager = NETunnelProviderManager()
      let proto = NETunnelProviderProtocol()
      proto.providerBundleIdentifier = "${EXTENSION_BUNDLE_ID}"
      proto.serverAddress = "AntiIGTest"
      manager.protocolConfiguration = proto
      manager.localizedDescription = "AntiIG VPN Test"
      manager.isEnabled = true
      manager.saveToPreferences { saveError in
        if let saveError = saveError {
          self.showVpnTestAlert(title: "saveToPreferences failed", message: "\\(saveError)")
          return
        }
        manager.loadFromPreferences { loadError in
          if let loadError = loadError {
            self.showVpnTestAlert(title: "loadFromPreferences failed", message: "\\(loadError)")
            return
          }
          do {
            try manager.connection.startVPNTunnel()
            self.showVpnTestAlert(title: "VPN start requested", message: "No error thrown. Check status bar for VPN icon.")
          } catch {
            self.showVpnTestAlert(title: "startVPNTunnel threw", message: "\\(error)")
          }
        }
      }
    }
`,
      anchor: /return super\.application\(application, didFinishLaunchingWithOptions: launchOptions\)/,
      offset: 0,
      comment: "//",
    }).contents;

    return config;
  });
};
