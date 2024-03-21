import React from "react";
import "./TaskCard.css";
import { IonCheckbox } from "@ionic/react";
import { useTaskContext } from "../../contexts/TaskContexts";

interface TaskCardProps {
  id: string;
  completed: boolean;
  title: string;
  date: Date;
  listName: string;
  task: any;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  completed,
  title,
  date,
  listName,
  task,
}) => {
  const { checkTaskPeriod } = useTaskContext();

  return (
    <div className="cardContainer" id={id}>
      <div>
        <IonCheckbox
          checked={completed}
          onClick={() => {
            checkTaskPeriod(task);
          }}></IonCheckbox>
      </div>
      <div>
        <div className="title">{title}</div>
        <div className="expireDate">{date.toDateString()}</div>
        <div className="listName">{listName}</div>
      </div>
    </div>
  );
};

export default TaskCard;

// const styles = {
//   cardContainer: {
//     boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
//     margin: "20px",
//   },
//   title: {
//     fontSize: "14px",
//     fontWeight: 600,
//   },
//   expireDate: {
//     fontSize: "10px",
//   },
//   listName: {
//     fontSize: "10px",
//   },
// };
