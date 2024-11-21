import React, { useState } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { mic, micOff, pause, play, call, close } from "ionicons/icons";

const CallControls = ({ onMute, onHold, onHangup }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isOnHold, setIsOnHold] = useState(false);

    const handleMute = () => {
        setIsMuted((prev) => !prev);
        onMute(!isMuted);
    };

    const handleHold = () => {
        setIsOnHold((prev) => !prev);
        onHold(!isOnHold);
    };

    return (
        <div className="call-controls">
            <IonButton onClick={handleMute} color="medium">
                <IonIcon slot="icon-only" icon={isMuted ? micOff : mic} />
            </IonButton>
            <IonButton onClick={handleHold} color="medium">
                <IonIcon slot="icon-only" icon={isOnHold ? play : pause} />
            </IonButton>
            <IonButton onClick={onHangup} color="danger">
                <IonIcon slot="icon-only" icon={close} />
            </IonButton>
        </div>
    );
};

export default CallControls;