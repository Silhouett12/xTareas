import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Storage } from "@ionic/storage";

// Define types
type Task = {
  id: string;
  title: string;
  period: string;
  expireDate: Date;
  completed: boolean;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (index: string) => void;
  toggleTaskCompletion: (index: string) => void;
  onCloseModal: () => void;
  checkTaskPeriod: (task: Task) => void;
  addTaskModal: boolean;
  onOpenModal: () => void;
};

// Create a context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Create a provider component
export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [store, setStore] = useState<Storage>();

  console.log(tasks);

  const checkTaskPeriod = (task: Task) => {
    // Calculate the new expiration date based on the period
    let newExpireDate = new Date(task.expireDate);
    switch (task.period) {
      case "daily":
        newExpireDate.setDate(newExpireDate.getDate() + 1); // Add 1 day
        break;
      case "weekly":
        newExpireDate.setDate(newExpireDate.getDate() + 7); // Add 7 days
        break;
      case "monthly":
        newExpireDate.setMonth(newExpireDate.getMonth() + 1); // Add 1 month
        break;
      case "yearly":
        newExpireDate.setFullYear(newExpireDate.getFullYear() + 1); // Add 1 year
        break;
      default:
        // Unsupported period
        console.error("Unsupported period:", task.period);
        return;
    }

    console.log(newExpireDate);
    

    // Update the expiration date of the task
    const updatedTask = { ...task, expireDate: newExpireDate };

    // Find the index of the task in the tasks array
    const taskIndex = tasks.findIndex((t) => t.id === task.id);
    if (taskIndex !== -1) {
      // Update the task in the tasks array
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = updatedTask;
      setTasks(updatedTasks);
    } else {
      console.error("Task not found:", task.id);
    }
  };

  let x = {
    id: "wgytotwnanc_1710986393785",
    title: "Test",
    period: "monthly",
    completed: false,
    expireDate: new Date("2024-03-21T01:59:53.000Z"),
  };

  const onCloseModal = () => {
    setAddTaskModal(false);
  };

  const onOpenModal = () => {
    setAddTaskModal(true);
  };

  // Function to add or edit a task
  const addTask = (task: Task) => {
    // Check if the task already exists in the tasks array
    const existingTaskIndex = tasks?.findIndex((t) => t.id === task.id);

    // If the task exists, update it
    if (existingTaskIndex !== -1) {
      const updatedTasks = [...tasks];
      updatedTasks[existingTaskIndex] = task;
      setTasks(updatedTasks);
    } else {
      // If the task doesn't exist, add it to the tasks array
      setTasks([...tasks, task]);
    }
  };

  // Function to remove a task by ID
  const removeTask = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  };

  // Function to toggle task completion status by ID
  const toggleTaskCompletion = (id: string) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const value: TaskContextType = {
    tasks,
    addTask,
    removeTask,
    toggleTaskCompletion,
    onCloseModal,
    addTaskModal,
    checkTaskPeriod,
    onOpenModal,
  };

  // Load tasks from localStorage on component mount

  useEffect(() => {
    const initStorage = async () => {
      const newStore = new Storage({
        name: "xTareasDB",
      });
      const store = await newStore.create();
      setStore(store);

      const savedTasks = (await store.get("TASKS_KEY")) || [];
      setTasks(savedTasks);
    };
    try {
      initStorage();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Save tasks to localStorage whenever tasks state changesF

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await store?.set("TASKS_KEY", tasks);
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
      }
    };

    saveTasks();
  }, [tasks]); // Run this effect whenever tasks state changes

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook to use the context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
