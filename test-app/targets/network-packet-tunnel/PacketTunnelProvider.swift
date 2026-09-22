import NetworkExtension

class PacketTunnelProvider: NEPacketTunnelProvider {

    override func startTunnel(options: [String : NSObject]?, completionHandler: @escaping (Error?) -> Void) {
        let settings = NEPacketTunnelNetworkSettings(tunnelRemoteAddress: "127.0.0.1")
        settings.ipv4Settings = NEIPv4Settings(addresses: ["10.0.0.2"], subnetMasks: ["255.255.255.0"])
        settings.ipv4Settings?.includedRoutes = []
        setTunnelNetworkSettings(settings) { error in
            completionHandler(error)
        }
    }
    
    override func stopTunnel(with reason: NEProviderStopReason, completionHandler: @escaping () -> Void) {
        // Add code here to start the process of stopping the tunnel.
        completionHandler()
    }
    
    override func handleAppMessage(_ messageData: Data, completionHandler: ((Data?) -> Void)?) {
        // Add code here to handle the message.
        if let handler = completionHandler {
            handler(messageData)
        }
    }
    
    override func sleep(completionHandler: @escaping () -> Void) {
        // Add code here to get ready to sleep.
        completionHandler()
    }
    
    override func wake() {
        // Add code here to wake up.
    }
}
