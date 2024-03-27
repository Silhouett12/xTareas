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
  list: string;
};
type List = {
  id: string;
  name: string;
};

type TaskContextType = {
  lists: List[];
  selectedList: List;
  deleteList: (index: string) => void;
  filteredTasks: CategorizedTasks;
  addList: (newList: List) => void;
  editList: (newList: List) => void;
  selectList: (newList: List) => void;
  addTask: (task: Task) => void;
  removeTask: (index: string) => void;
  toggleTaskCompletion: (index: string) => void;
  onCloseModal: () => void;
  checkTaskPeriod: (task: Task) => void;
  addTaskModal: boolean;
  onOpenModal: () => void;
};

interface CategorizedTasks {
  Atrasado: Task[];
  Hoy: Task[];
  Mañana: Task[];
  "Siguientes semanas": Task[];
  "Siguiente mes": Task[];
  "Más tarde": Task[];
  "Siguiente año": Task[];
}

// Create a context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Create a provider component
export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List>({
    id: "1",
    name: "Default",
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksByList, setTasksByList] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<CategorizedTasks>({
    Atrasado: [],
    Hoy: [],
    Mañana: [],
    "Siguientes semanas": [],
    "Siguiente mes": [],
    "Más tarde": [],
    "Siguiente año": [],
  });
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [store, setStore] = useState<Storage>();

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

    const categorizedTasks = tasksByList?.reduce<CategorizedTasks>(
      (acc, task) => {
        const expireDate = new Date(task.expireDate);
        if (expireDate < today) {
          acc.Atrasado.push(task);
        } else if (
          expireDate.toISOString().slice(0, 10) ===
          today.toISOString().slice(0, 10)
        ) {
          acc.Hoy.push(task);
        } else if (expireDate <= tomorrow && expireDate > today) {
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
        Atrasado: [],
        Hoy: [],
        Mañana: [],
        ["Siguientes semanas"]: [],
        "Siguiente mes": [],
        "Siguiente año": [],
        "Más tarde": [],
      }
    );

    setFilteredTasks(categorizedTasks);
  };

  useEffect(() => {
    filterTasksByDate();
  }, [tasksByList]);

  const checkTaskPeriod = (task: Task) => {
    // Calculate the new expiration date based on the period
    if (!task.expireDate) {
      console.error("Task expireDate is undefined");
      return;
    }
    console.log(task);
    
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

      // Check if the list is empty when the app is opened for the first time
      const savedList = await store?.get("LIST_KEY");
      if (!savedList || savedList.length === 0) {
        // Create a default list if the saved list is empty
        const defaultList = [{ id: "1", name: "Default" }];
        await store?.set("LIST_KEY", defaultList);
        setLists(defaultList);
      } else {
        // Set the existing list if it's not empty
        setLists(savedList);
      }
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

  useEffect(() => {
    const saveLists = async () => {
      try {
        await store?.set("LIST_KEY", lists);
      } catch (error) {
        console.error("Error saving list to localStorage:", error);
      }
    };

    saveLists();
  }, [lists]); // Run this effect whenever tasks state changes

  useEffect(() => {
    listedTasks();
  }, [selectedList, tasks]);

  //////// LIST LOGIC ////////

  const deleteList = (id: string) => {
    const newList = lists.filter((item) => item.id !== id);
    console.log(newList);
    setLists(newList);
  };

  const addList = (newList: List) => {
    setLists([...lists, newList]);
  };

  const editList = (newList: List) => {
    console.log(newList);

    const updatedList = lists.map((item) =>
      item.id === newList.id ? { ...item, name: newList.name } : item
    );
    console.log(updatedList);

    setLists(updatedList);
  };

  const selectList = (list: List) => {
    setSelectedList(list);
  };

  const listedTasks = () => {
    console.log(tasks);
    console.log(selectedList);

    const filterByListTasks = tasks.filter(
      (task) => task.list === selectedList.name
    );
    setTasksByList(filterByListTasks);
  };

  console.log(tasksByList);

  console.log(filteredTasks);

  const value: TaskContextType = {
    filteredTasks,
    lists,
    addList,
    deleteList,
    editList,
    selectList,
    selectedList,
    addTask,
    removeTask,
    toggleTaskCompletion,
    onCloseModal,
    addTaskModal,
    checkTaskPeriod,
    onOpenModal,
  };

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
