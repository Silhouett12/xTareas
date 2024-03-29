import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import React from "react";
import { add } from "ionicons/icons";
import "./createTaskButton.css";

interface CreateTaskButtonProps {
  openTaskModal: (edit: string) => void;
}

const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({
  openTaskModal,
}) => {
  return (
    <IonFab
      slot="fixed"
      vertical="bottom"
      horizontal="end"
      onClick={() => openTaskModal("")}>
      <IonFabButton color="dark">
        <IonIcon icon={add}></IonIcon>
      </IonFabButton>
    </IonFab>
  );
};

export default CreateTaskButton;
