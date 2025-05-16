import { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";

function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

// Translation dictionary
const TRANSLATIONS = {
  en: {
    appTitle: "TodoMatic",
    addTask: "Add Task",
    tasksRemaining: (count) => `${count} ${count !== 1 ? "tasks" : "task"} remaining`,
    filters: {
      All: "All",
      Active: "Active",
      Completed: "Completed"
    }
  },
  uz: {
    appTitle: "TodoMatic",
    addTask: "Vazifa qo'shish",
    tasksRemaining: (count) => `${count} ta ${count !== 1 ? "vazifa" : "vazifa"} qoldi`,
    filters: {
      All: "Hammasi",
      Active: "Aktiv",
      Completed: "Yakunlangan"
    }
  }
};

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");
  const [language, setLanguage] = useState("en"); // 'en' or 'uz'

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "uz" : "en");
  };

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const taskList = tasks
    ?.filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={TRANSLATIONS[language].filters[name] || name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(name) {
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
    setTasks([...tasks, newTask]);
  }

  const headingText = TRANSLATIONS[language].tasksRemaining(taskList.length);

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <div className="language-toggle">
        <button 
          onClick={toggleLanguage}
          className="btn btn__primary"
          style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}
        >
          {language === 'en' ? 'UZB' : 'ENG'}
        </button>
      </div>
      <h1>{TRANSLATIONS[language].appTitle}</h1>
      <Form addTask={addTask} placeholder={TRANSLATIONS[language].addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        aria-labelledby="list-heading"
        className="todo-list stack-large stack-exception"
        role="list"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;