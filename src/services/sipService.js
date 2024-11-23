import { UserAgent, Registerer, Inviter } from 'sip.js';


class SipService {
    constructor(server, username, password) {
        this.server = process.env.SIP_SERVER;
        this.username = process.env.SIP_USERNAME;
        this.password = process.env.SIP_PASSWORD;
        this.userAgent = null;
        this.registerer = null;
    }

    async requestAudioPermission() {
        try {
            // Request microphone access
            this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Microphone access granted");

            // Optionally handle speaker output (set preferred device)
            await this.getAudioOutputDevices();
        } catch (error) {
            console.error("Microphone access denied", error);
        }
    }

    async getAudioOutputDevices() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
        console.log("Available audio output devices:", audioOutputs);

        // Use the first audio output device (if available)
        if (audioOutputs.length > 0) {
            const audioElement = document.createElement('audio');
            try {
                await audioElement.setSinkId(audioOutputs[0].deviceId);
                console.log("Audio output set to", audioOutputs[0].label);
            } catch (error) {
                console.error("Error setting audio output:", error);
            }
        }
    }

    start() {
        const uri = `sip:${this.username}@${this.server}`;
        const transportOptions = {
            // server: `wss://${this.server}/ws`, // WebSocket URL for your SIP server
            server: `wss://my.sip.ir/ws`, //
        };

        const userAgentOptions = {
            uri,
            transportOptions,
            authorizationUsername: this.username,
            authorizationPassword: this.password,
        };

        // Initialize UserAgent from SIP.js
        this.userAgent = new UserAgent(userAgentOptions);

        // Connect the user agent
        this.userAgent.start().then(() => {
            console.log("User agent started");
            this.register();
        }).catch((error) => {
            console.error("Failed to start user agent", error);
        });
    }

    register() {
        if (!this.userAgent) return;

        this.registerer = new Registerer(this.userAgent);
        this.registerer.register().then(() => {
            console.log("Registered successfully");
        }).catch((error) => {
            console.error("Failed to register", error);
        });
    }

    makeCall(target) {
        if (!this.userAgent) return;

        const inviter = new Inviter(this.userAgent, `sip:${target}@${this.server}`);
        inviter.invite().then(() => {
            console.log(`Calling ${target}`);
        }).catch((error) => {
            console.error("Failed to make call", error);
        });
    }

    receiveCall(onCallReceived) {
        if (!this.userAgent) return;

        this.userAgent.delegate = {
            onInvite: (invitation) => {
                console.log("Incoming call received");
                onCallReceived(invitation);
            },
        };
    }

    // Mute, hold, hangup call methods...
    muteCall(muted) {
        // Logic to mute/unmute the microphone
        if (this.userAgent) {
            const mediaHandler = this.userAgent._mediaHandler;
            if (mediaHandler) {
                mediaHandler.setMute(muted);
            }
        }
    }

    holdCall(onHold) {
        // Logic to hold/unhold the call
        if (this.userAgent) {
            const inviter = this.userAgent._inviter;
            if (onHold) {
                inviter.hold();
            } else {
                inviter.unhold();
            }
        }
    }

    hangUpCall() {
        if (this.userAgent) {
            const inviter = this.userAgent._inviter;
            if (inviter) {
                inviter.bye();
            }
        }
    }
}

export default SipService;
