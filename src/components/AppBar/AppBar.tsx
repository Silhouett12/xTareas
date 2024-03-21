import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./appBar.css";

const AppBar = () => {
  return (
    <>
      <IonMenu side="end">
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonLabel>Crear una lista</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonHeader>
        <IonToolbar className="other">
          <IonButtons slot="primary">
            <IonMenuToggle menu="main-content" autoHide={false}>
              <IonMenuButton></IonMenuButton>
            </IonMenuToggle>
          </IonButtons>
          <IonTitle>Lista de tareas</IonTitle>
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export default AppBar;
