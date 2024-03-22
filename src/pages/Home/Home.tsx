import React, { useEffect, useState } from "react";
import { IonContent, IonPage, IonTitle } from "@ionic/react";
import AppBar from "../../components/AppBar/AppBar";
import CreateTaskButton from "../../components/CreateTaskbutton/CreateTaskButton";
import CreateTaskForm from "../../components/CreateTaskForm/CreateTaskForm";
import TaskCard from "../../components/TaskCard/TaskCard";
import { useTaskContext } from "../../contexts/TaskContexts";
import "./Home.css";

interface CategorizedTasks {
  Hoy: Task[];
  Mañana: Task[];
  "Siguientes semanas": Task[];
  "Siguiente mes": Task[];
  "Más tarde": Task[];
  "Siguiente año": Task[];
}

interface Task {
  id: string;
  expireDate: Date;
  completed: boolean;
  title: string;
}

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<CategorizedTasks>({
    Hoy: [],
    Mañana: [],
    "Siguientes semanas": [],
    "Siguiente mes": [],
    "Más tarde": [],
    "Siguiente año": [],
  });
  const { tasks } = useTaskContext();

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const filterTasksByDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + ((1 - today.getDay() + 7) % 7));
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    const nextMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );
    const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    const nextYearStart = new Date(today.getFullYear() + 1, 0, 1);
    const nextYearEnd = new Date(today.getFullYear() + 1, 11, 31);

    const categorizedTasks = tasks?.reduce<CategorizedTasks>(
      (acc, task) => {
        const expireDate = new Date(task.expireDate);
        if (
          expireDate.toISOString().slice(0, 10) ===
          today.toISOString().slice(0, 10)
        ) {
          acc.Hoy.push(task);
        } else if (expireDate <= tomorrow) {
          acc.Mañana.push(task);
        } else if (expireDate >= nextWeekStart && expireDate < nextMonthStart) {
          acc["Siguientes semanas"].push(task);
        } else if (expireDate >= nextMonthStart && expireDate <= nextMonthEnd) {
          acc["Siguiente mes"].push(task);
        } else if (expireDate >= nextYearStart && expireDate <= nextYearEnd) {
          acc["Siguiente año"].push(task);
        } else {
          acc["Más tarde"].push(task);
        }
        return acc;
      },
      {
        Hoy: [],
        Mañana: [],
        ["Siguientes semanas"]: [],
        "Siguiente mes": [],
        "Siguiente año": [],
        "Más tarde": [],
      }
    );

    if (categorizedTasks) {
      setFilteredTasks(categorizedTasks);
    }
  };

  useEffect(() => {
    filterTasksByDate();
  }, [tasks]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <AppBar />
        <CreateTaskButton openTaskModal={openModal} />
        <CreateTaskForm openTaskModal={showModal} onClose={closeModal} />
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
