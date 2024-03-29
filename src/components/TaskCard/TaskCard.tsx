import React, { useState } from "react";
import "./TaskCard.css";
import { IonCheckbox } from "@ionic/react";
import { useTaskContext } from "../../contexts/TaskContexts";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";

interface TaskCardProps {
  id: string;
  completed: boolean;
  title: string;
  date: string;
  listName: string;
  task: any;
  setSelectedTask: React.Dispatch<React.SetStateAction<any>>;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  completed,
  title,
  date,
  listName,
  task,
  setSelectedTask,
}) => {
  const { checkTaskPeriod } = useTaskContext();

  return (
    <div
      className="cardContainer"
      id={id}
      onClick={() => {
        setSelectedTask(task);
      }}>
      <div>
        <IonCheckbox
          checked={completed}
          onClick={(e) => {
            e.stopPropagation();
            checkTaskPeriod(task);
          }}></IonCheckbox>
      </div>
      <div>
        <div className="title">{title}</div>
        <div className="expireDate">{date}</div>
        <div className="listName">{listName}</div>
      </div>
    </div>
  );
};

export default TaskCard;
