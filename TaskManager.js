import React, { useState, useEffect } from "react";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  // Fetch tasks from Flask API
  const fetchTasks = () => {
    fetch("http://127.0.0.1:5000/tasks")
      .then(response => response.json())
      .then(data => setTasks(data));
  };

  // Fetch categories
  const fetchCategories = () => {
    fetch("http://127.0.0.1:5000/categories")
      .then(response => response.json())
      .then(data => setCategories(data));
  };

  // Add task
  const addTask = () => {
    fetch("http://127.0.0.1:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: newTask, category: selectedCategory }),
    })
      .then(response => response.json())
      .then(() => {
        setNewTask("");
        fetchTasks();
      });
  };

  // Delete a task
  const deleteTask = (index) => {
    fetch(`http://127.0.0.1:5000/tasks/${index}`, { method: "DELETE" })
      .then(response => response.json())
      .then(() => fetchTasks());
  };

  // Mark task as completed
  const completeTask = (index) => {
    fetch(`http://127.0.0.1:5000/tasks/${index}/complete`, { method: "PATCH" })
      .then(response => response.json())
      .then(() => fetchTasks());
  };

  // Create a new category
  const createCategory = () => {
    fetch("http://127.0.0.1:5000/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: newCategory }),
    })
      .then(response => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          setNewCategory("");
          fetchCategories();
        }
      });
  };

  return (
    <div>
      <h1></h1>

      <label>Choose Category: </label>
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        {categories.map((category, index) => (
          <option key={index} value={category}>{category}</option>
        ))}
      </select>

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={addTask}>Add Task</button>

      {/* Task List */}
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => completeTask(index)}
            />
            {task.completed ? <s>{task.task}</s> : task.task} - {task.category}
            <button onClick={() => deleteTask(index)} style={{ marginLeft: "10px", color: "red" }}>
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
      {/* Create New Category */}
      <h3>Create a New Category</h3>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
        />
      <button onClick={createCategory}>Create Category</button>
    </div>
  );
};

export default TaskManager;
