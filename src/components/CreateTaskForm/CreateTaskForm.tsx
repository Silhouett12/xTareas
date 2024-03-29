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
import {
  arrowBackOutline,
  checkmarkOutline,
  list,
  trash,
} from "ionicons/icons";
import "./createTaskForm.css";
import dayjs from "dayjs";

interface CreateTaskFormProps {
  openTaskModal: boolean;
  onClose: () => void; // Function to close the modal
  editTask?: Task | null; // Optional task to edit
}

type Task = {
  id: string;
  title: string;
  period: string;
  expireDate: string;
  completed: boolean;
  list: string;
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
    list: "Default",
    expireDate: new Date().toISOString(),
    completed: false,
  });

  const [isToastOpen, setIsToastOpen] = useState(false);

  const { addTask, lists, removeTask } = useTaskContext();

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
        list: "Default",
        completed: false,
        expireDate: new Date().toISOString(),
      });
    }
  }, [editTask]);

  const handleDateChange = (e: CustomEvent<any>) => {
    const newDate = new Date(e.detail.value).toISOString();
    setTask({ ...task, expireDate: newDate });
  };

  const handleClose = () => {
    addTask(task);
    onClose();
    setTask({
      id: generateRandomId(),
      title: "",
      period: "",
      list: "Default",
      completed: false,
      expireDate: new Date().toISOString(),
    });
  };

  console.log(task);

  return (
    <IonModal isOpen={openTaskModal} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon icon={arrowBackOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Nueva tarea</IonTitle>
          {editTask && (
            <IonButtons slot="end">
              <IonButton
                onClick={() => {
                  removeTask(task.id);
                  onClose();
                }}>
                <IonIcon icon={trash}></IonIcon>
              </IonButton>
            </IonButtons>
          )}
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
              onIonChange={(e) => setTask({ ...task, period: e.detail.value! })}
              value={task.period ? task.period : ""}>
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
            <IonSelect
              placeholder="Seleccionar lista"
              onIonChange={(e) => {
                setTask({ ...task, list: e.detail.value });
              }}
              value={task.list ? task.list : "Default"}>
              <div slot="label">Añadir a la lista</div>
              {lists.map((list) => (
                <IonSelectOption key={list.id} value={list.name}>
                  {list.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </div>
        <IonToast
          isOpen={isToastOpen}
          position="bottom"
          onDidDismiss={() => setIsToastOpen(false)}
          message="Complete la tarea primero"
          duration={2000}></IonToast>
        <IonFab
          slot="fixed"
          vertical="bottom"
          horizontal="end"
          onClick={() => {
            task.title ? handleClose() : setIsToastOpen(true);
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
