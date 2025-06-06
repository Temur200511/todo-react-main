import { useState } from "react";

function Form({ addTask, placeholder = "Add Task" }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    addTask(name);
    setName("");
  }

  function handleChange(e) {
    setName(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          {placeholder}
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        {placeholder}
      </button>
    </form>
  );
}

export default Form;