import React, { useState } from "react";
import { IonPage, IonHeader, IonContent, IonInput, IonButton } from "@ionic/react";
import SipService from "../services/sipService";

const Dialer = () => {
    const [sipService, setSipService] = useState(null);
    const [target, setTarget] = useState("");

    const initSipService = () => {
        const service = new SipService("voip.asiatech.ir", "username", "password");
        service.start();
        setSipService(service);
    };

    const handleCall = () => {
        if (sipService) {
            sipService.makeCall(target);
        }
    };

    const handleReceiveCall = () => {
        if (sipService) {
            sipService.receiveCall((invitation) => {
                console.log("Incoming call:", invitation);
            });
        }
    };

    return (
        <IonPage>
            <IonHeader>Dialer</IonHeader>
            <IonContent>
                <IonInput
                    placeholder="Enter number"
                    onIonChange={(e) => setTarget(e.target.value)}
                />
                <IonButton onClick={handleCall}>Call</IonButton>
                <IonButton onClick={handleReceiveCall}>Receive Calls</IonButton>
                <IonButton onClick={initSipService}>Initialize</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Dialer;