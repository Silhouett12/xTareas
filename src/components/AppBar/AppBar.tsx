import {
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./appBar.css";

const AppBar = () => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista de tareas</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export default AppBar;
