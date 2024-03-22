import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

const SideMenu = () => {
  return (
    <IonMenu side="end" contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Herramientas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonMenuToggle>
            <IonItem button routerLink={"/lists"}>
              <IonLabel>Listas</IonLabel>
            </IonItem>{" "}
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
