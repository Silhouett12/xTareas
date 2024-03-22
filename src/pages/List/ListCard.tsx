import React, { useRef, useState } from "react";
import { useTaskContext } from "../../contexts/TaskContexts";
import {
  IonActionSheet,
  IonIcon,
  IonInput,
  IonItem,
  IonModal,
  IonText,
  IonTitle,
} from "@ionic/react";
import { createOutline, trashOutline } from "ionicons/icons";
import "./listCard.css";

type List = {
  id: string;
  name: string;
};

type ListProps = {
  id: string;
  name: string;
  list: List;
};

const ListCard: React.FC<ListProps> = ({ name, id, list }) => {
  const { deleteList, editList } = useTaskContext();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleDeleteList = (id: string) => {
    setIsDeleteOpen(false); // Close the action sheet
    deleteList(id); // Call the deleteList function with the list ID
  };

  const handleEditList = () => {
    if (!newName) {
      console.error("Name cannot be empty!");
      return;
    }
    const updatedList = { ...list, name: newName };
    setIsEditOpen(false);
    editList(updatedList);
  };

  console.log(newName);

  return (
    <div className="card-container">
      <div className="info-container">
        <div className="title">{name}</div>
        <div className="description">No hay tareas</div>
      </div>

      {id !== "1" && (
        <div className="actions-container">
          <IonIcon
            icon={createOutline}
            size="large"
            onClick={() => setIsEditOpen(true)}></IonIcon>

          <IonIcon
            icon={trashOutline}
            size="large"
            onClick={() => setIsDeleteOpen(true)}></IonIcon>
        </div>
      )}

      <IonModal
        isOpen={isDeleteOpen}
        onDidDismiss={() => setIsDeleteOpen(false)}
        id="delete-list-modal">
        <div className="modal-props">
          <IonTitle>¿Estás seguro?</IonTitle>
          <IonItem>
            <IonText>Se eliminarán todas las tareas de la lista.</IonText>
          </IonItem>
          <div className="modal-buttons-container">
            <IonText onClick={() => setIsDeleteOpen(false)}>Cancelar</IonText>
            <IonText onClick={() => handleDeleteList(id)}>Eliminar</IonText>
          </div>
        </div>
      </IonModal>

      <IonModal
        isOpen={isEditOpen}
        onDidDismiss={() => setIsEditOpen(false)}
        id="delete-list-modal">
        <div className="modal-props">
          <IonTitle>Editar lista</IonTitle>

          <IonItem>
            <IonInput
              label="Nombre de la lista"
              labelPlacement="stacked"
              value={newName}
              type="text"
              onIonInput={(e) => setNewName(e.detail.value!)} // Assuming you have a 'setName' state function
            />
          </IonItem>
          <div className="modal-buttons-container">
            <IonText onClick={() => setIsEditOpen(false)}>Cancelar</IonText>
            <IonText onClick={() => handleEditList()}>Guardar</IonText>
          </div>
        </div>
      </IonModal>
    </div>
  );
};

export default ListCard;
