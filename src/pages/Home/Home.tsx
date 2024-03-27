import React, { useEffect, useState } from "react";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import CreateTaskButton from "../../components/CreateTaskbutton/CreateTaskButton";
import CreateTaskForm from "../../components/CreateTaskForm/CreateTaskForm";
import TaskCard from "../../components/TaskCard/TaskCard";
import { useTaskContext } from "../../contexts/TaskContexts";
import "./Home.css";

interface Task {
  id: string;
  expireDate: Date;
  completed: boolean;
  title: string;
}

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const { filteredTasks, lists, selectedList, selectList } = useTaskContext();

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };



  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <IonSelect
                no-lines
                value={selectedList.name}
                labelPlacement="start"
                onIonChange={(e) => {
                  const selectedListName = e.detail.value; // Get the selected list name
                  const selectedList = lists.find(
                    (list) => list.name === selectedListName
                  ); // Find the list object based on the name
                  if (selectedList) {
                    selectList(selectedList); // Pass the selected list object to the selectList function
                  }
                }}>
                {lists.map((list) => (
                  <IonSelectOption hidden key={list.id} value={list.name}>
                    {list.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonTitle>
            <IonButtons slot="end">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <CreateTaskButton openTaskModal={openModal} />
        {showModal && (
          <CreateTaskForm openTaskModal={showModal} onClose={closeModal} />
        )}
        <div className="task-container">
          {Object.entries(filteredTasks)?.map(([category, tasks]) => (
            <div key={category}>
              {tasks.length > 0 && (
                <IonTitle size="small" className="title">
                  {category}
                </IonTitle>
              )}
              {tasks.map((task: Task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  task={task}
                  date={task.expireDate}
                  completed={task.completed}
                  title={task.title}
                  listName={category}
                />
              ))}
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
