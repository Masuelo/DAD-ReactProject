import React, { useReducer, useEffect } from "react";
import Chatbot from "./Chatbot";

// Tipos de acciones para el reducer
type Action =
  | { type: "ADD_TASK"; task: string }
  | { type: "DELETE_TASK"; index: number }
  | { type: "LOAD_TASKS"; tasks: string[] };

// Reducer para gestionar el estado de las tareas
const tasksReducer = (state: string[], action: Action): string[] => {
  switch (action.type) {
    case "ADD_TASK":
      return [...state, action.task];
    case "DELETE_TASK":
      return state.filter((_, index) => index !== action.index);
    case "LOAD_TASKS":
      return action.tasks;
    default:
      return state;
  }
};

// Componente de entrada de tareas
const TaskInput: React.FC<{ dispatch: React.Dispatch<Action> }> = ({ dispatch }) => {
  const [task, setTask] = React.useState("");

  const handleAddTask = () => {
    if (task.trim() === "") return;
    dispatch({ type: "ADD_TASK", task });
    setTask("");
  };

  return (
    <div>
      <input
        id="inputField"
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Escribe una tarea..."
        style={{ marginRight: "0.8em", width: "35em" }}
      />
      <button id="addTask" onClick={handleAddTask}>
        Agregar Tarea
      </button>
    </div>
  );
};

// Componente de lista de tareas
const TaskList: React.FC<{ tasks: string[]; dispatch: React.Dispatch<Action> }> = ({ tasks, dispatch }) => {
  return (
    <div id="contentTasks">
      <ol id="ulTasks">
        {tasks.map((task, index) => (
          <li key={index}>
            {task}{" "}
            <button
              id="taskButton"
              onClick={() => dispatch({ type: "DELETE_TASK", index })}
            >
              Eliminar
            </button>
            <hr />
          </li>
        ))}
      </ol>
    </div>
  );
};

// Componente principal del gestor de tareas
const TaskManager: React.FC = () => {
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  // Cargar tareas desde localStorage al iniciar
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      dispatch({ type: "LOAD_TASKS", tasks: JSON.parse(savedTasks) });
    }
  }, []);

  // Guardar tareas en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div id="tasks">
      <h2 id="title">Gestor de Tareas</h2>
      <TaskInput dispatch={dispatch} />
      <TaskList tasks={tasks} dispatch={dispatch} />
      <Chatbot />
    </div>
    
  );
};

export default TaskManager;