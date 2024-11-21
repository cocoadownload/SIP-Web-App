import React from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonButton } from "@ionic/react";

const IncomingCall = ({ caller, onAccept, onDecline }) => {
    return (
        <IonCard className="incoming-call">
            <IonCardHeader>
                <IonCardTitle>Incoming Call</IonCardTitle>
                <p>From: {caller}</p>
            </IonCardHeader>
            <div className="call-actions">
                <IonButton color="success" onClick={onAccept}>
                    Accept
                </IonButton>
                <IonButton color="danger" onClick={onDecline}>
                    Decline
                </IonButton>
            </div>
        </IonCard>
    );
};

export default IncomingCall;
