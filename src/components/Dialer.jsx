import React, { useState, useEffect } from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from "@ionic/react";
import SipService from "../services/sipService";
import CallControls from "./CallControls";  // Importing CallControls
import IncomingCall from "./IncomingCall";  // Importing IncomingCall
import "./Dialer.css";

const Dialer = () => {
    const [sipService, setSipService] = useState(null);
    const [target, setTarget] = useState("");
    const [isCalling, setIsCalling] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);

    useEffect(() => {
        const service = new SipService("my.server.com", "myusername", "mypassword");
        service.start();
        setSipService(service);

        // Handle incoming call setup
        service.receiveCall((invitation) => {
            setIncomingCall({ caller: invitation.caller });
        });
    }, []);

    const handleCall = () => {
        if (sipService && target) {
            sipService.makeCall(target);
            setIsCalling(true);
        }
    };

    const handleReceiveCall = (accept) => {
        if (accept) {
            // Accept the incoming call (you may need to handle this in your SIP service)
            sipService.acceptCall(incomingCall);
        }
        setIncomingCall(null);
    };

    const handleMute = (muted) => {
        // Mute or unmute the call
        if (sipService) {
            sipService.muteCall(muted);
        }
    };

    const handleHold = (onHold) => {
        // Hold or resume the call
        if (sipService) {
            sipService.holdCall(onHold);
        }
    };

    const handleHangup = () => {
        if (sipService) {
            sipService.hangUpCall();
            setIsCalling(false);
        }
    };

    // Key press handler
    const handleKeyPress = (key) => {
        setTarget((prevTarget) => prevTarget + key);
    };

    const handleDelete = () => {
        setTarget((prevTarget) => prevTarget.slice(0, -1));
    };

    return (
        <div className="dialer-container">
            {/* Phone Number Display */}
            <div className="number-display">{target || "Enter Number"}</div>

            {/* Keypad */}
            <div className="keypad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
                    <button
                        key={key}
                        className="keypad-button"
                        onClick={() => handleKeyPress(key.toString())}
                    >
                        {key}
                    </button>
                ))}
            </div>

            {/* Call Controls */}
            {isCalling || incomingCall ? (
                <CallControls
                    onMute={handleMute}
                    onHold={handleHold}
                    onHangup={handleHangup}
                />
            ) : null}

            {/* Controls */}
            {!incomingCall && !isCalling ? (
                <div className="controls">
                    <button className="call-button" onClick={handleCall}>
                        📞
                    </button>
                    <button className="delete-button" onClick={handleDelete}>
                        ⌫
                    </button>
                </div>
            ) : null}

            {/* Incoming Call */}
            {incomingCall && (
                <IncomingCall
                    caller={incomingCall.caller}
                    onAccept={() => handleReceiveCall(true)}
                    onDecline={() => handleReceiveCall(false)}
                />
            )}
        </div>
    );
};

export default Dialer;
