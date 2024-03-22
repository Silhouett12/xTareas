import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonMenuButton,
  IonModal,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useTaskContext } from "../../contexts/TaskContexts";
import ListCard from "./ListCard";
import { addOutline } from "ionicons/icons";
import { useRef, useState } from "react";

const Lists = () => {
  const { lists, addList } = useTaskContext();

  const generateRandomId = () => {
    const randomString = Math.random().toString(36).substring(2);
    const timestamp = Date.now();
    const randomId = randomString + "_" + timestamp;
    return randomId;
  };

  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  const handleList = (newListName: string) => {
    const newList = {
      id: generateRandomId(),
      name: newListName,
    };

    addList(newList);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Listas</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton id="open-modal">
              <IonIcon icon={addOutline} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {lists.map((el) => (
          <ListCard key={el.id} id={el.id} name={el.name} list={el} />
        ))}
      </IonContent>

      <IonModal ref={modal} trigger="open-modal" id="add-list-modal">
        <div className="modal-props">
          <IonTitle>Nueva lista</IonTitle>
          <IonItem>
            <IonInput
              label="Nombre de la lista"
              labelPlacement="stacked"
              ref={input}
              type="text"
              placeholder="Compras..."
            />
          </IonItem>
          <div className="modal-buttons-container">
            <IonText onClick={() => modal.current?.dismiss()}>Cancelar</IonText>
            <IonText
              onClick={() => {
                if (input.current?.value) {
                  handleList(input.current.value.toString());
                  input.current.value = ""; // Clear input after adding list
                }
                modal.current?.dismiss();
              }}>
              Agregar
            </IonText>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default Lists;
