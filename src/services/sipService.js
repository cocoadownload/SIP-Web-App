import { UserAgent, UserAgentOptions, Registerer, Inviter, Invitation } from "sip.js";

class SipService {
    constructor(server, username, password) {
        const userAgentOptions = {
            uri: `sip:${username}@${server}`,
            transportOptions: {
                server: `wss://${server}`
            },
            authorizationUsername: username,
            authorizationPassword: password
        };

        this.userAgent = new UserAgent(userAgentOptions);
        this.registerer = null;
        this.session = null;
    }

    async start() {
        await this.userAgent.start();
        this.registerer = new Registerer(this.userAgent);
        await this.registerer.register();
    }

    async makeCall(target) {
        const inviter = new Inviter(this.userAgent, `sip:${target}`);
        this.session = await inviter.invite();
    }

    async receiveCall(onCallReceived) {
        this.userAgent.delegate = {
            onInvite: async (invitation) => {
                this.session = invitation;
                onCallReceived(invitation);
            }
        };
    }

    async hangup() {
        if (this.session) {
            await this.session.bye();
            this.session = null;
        }
    }
}

export default SipService;