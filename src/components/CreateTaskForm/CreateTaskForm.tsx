import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { useTaskContext } from "../../contexts/TaskContexts";
import { arrowBackOutline, checkmarkOutline } from "ionicons/icons";
import "./createTaskForm.css";

interface CreateTaskFormProps {
  openTaskModal: boolean;
  onClose: () => void; // Function to close the modal
  editTask?: Task; // Optional task to edit
}

type Task = {
  id: string;
  title: string;
  period: string;
  expireDate: Date;
  completed: boolean;
};

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  openTaskModal,
  onClose,
  editTask,
}) => {
  const [task, setTask] = useState<Task>({
    id: "",
    title: "",
    period: "",
    expireDate: new Date(),
    completed: false,
  });

  const { addTask } = useTaskContext();

  const generateRandomId = () => {
    const randomString = Math.random().toString(36).substring(2);
    const timestamp = Date.now();
    const randomId = randomString + "_" + timestamp;
    return randomId;
  };

  useEffect(() => {
    if (editTask) {
      setTask(editTask);
    } else {
      setTask({
        id: generateRandomId(),
        title: "",
        period: "",
        completed: false,
        expireDate: new Date(),
      });
    }
  }, [editTask]);

  const handleDateChange = (e: CustomEvent<any>) => {
    const newDate = new Date(e.detail.value);
    setTask({ ...task, expireDate: newDate });
  };

  const handleClose = () => {
    addTask(task);
    onClose();
    setTask({
      id: generateRandomId(),
      title: "",
      period: "",
      completed: false,
      expireDate: new Date(),
    });
  };

  console.log(task);
  

  return (
    <IonModal isOpen={openTaskModal} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon slot="end" icon={arrowBackOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Nueva tarea</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="form-container">
          <IonItem>
            <IonInput
              label="¿Que tienes que hacer?"
              labelPlacement="stacked"
              value={task.title}
              placeholder="Introduzca una tarea"
              onIonInput={(e) =>
                setTask({ ...task, title: e.detail.value! })
              }></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel style={{ width: "100%" }}>
              <h4 style={{ display: "flex", width: "100%" }}>Fecha limite</h4>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
              </div>
            </IonLabel>
            <IonModal keepContentsMounted={true}>
              <IonDatetime
                id="datetime"
                showDefaultButtons
                onIonChange={handleDateChange}></IonDatetime>
            </IonModal>
          </IonItem>

          <IonItem>
            <IonSelect
              placeholder="Sin repetición"
              onIonChange={(e) =>
                setTask({ ...task, period: e.detail.value! })
              }>
              <div slot="label">Se repite</div>
              <IonSelectOption value="norepeat">Sin repetición</IonSelectOption>
              <IonSelectOption value="daily">Una vez al día</IonSelectOption>
              <IonSelectOption value="weekly">
                Una vez a la semana
              </IonSelectOption>
              <IonSelectOption value="monthly">Una vez al mes</IonSelectOption>
              <IonSelectOption value="yearly">Una vez al año</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonSelect placeholder="Seleccionar lista">
              <div slot="label">Añadir a la lista</div>
              <IonSelectOption value="norepeat">Por defecto</IonSelectOption>
            </IonSelect>
          </IonItem>
        </div>
        <IonToast
          trigger="open-toast"
          position="bottom"
          message="Complete la tarea primero"
          duration={2000}></IonToast>
        <IonFab
          slot="fixed"
          id="open-toast"
          vertical="bottom"
          horizontal="end"
          onClick={() => {
            task.title ? handleClose() : null;
          }}>
          <IonFabButton color="dark">
            <IonIcon icon={checkmarkOutline}></IonIcon>
          </IonFabButton>
        </IonFab>
        {/* Add more input fields for other task properties */}
      </IonContent>
    </IonModal>
  );
};

export default CreateTaskForm;
