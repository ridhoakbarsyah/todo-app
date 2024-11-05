import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch("http://localhost/backend/task.php");
    const data = await response.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await fetch("http://localhost/backend/task.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newTask }), // Send the task text
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const task = await response.json(); // Expect the backend to return the added task
        setTasks((prevTasks) => [...prevTasks, task]); // Add the new task to the list
        setNewTask(""); // Clear the input field
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    } else {
      alert("Task cannot be empty."); // Alert if the input is empty
    }
  };


  const toggleComplete = async (id) => {
    const task = tasks.find((task) => task.id === id);
    const updatedTask = { ...task, completed: !task.completed };

    await fetch("http://localhost/backend/task.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
  };

  const editTask = async (id, newText) => {
    const updatedTask = { id, text: newText, completed: tasks.find((task) => task.id === id).completed };

    await fetch("http://localhost/backend/task.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    setIsEditing(null);
  };

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      await fetch(`http://localhost/backend/task.php?id=${id}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <div className="add-task">
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter a new task" />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            {isEditing === task.id ? <input type="text" defaultValue={task.text} onBlur={(e) => editTask(task.id, e.target.value)} autoFocus /> : <span onClick={() => setIsEditing(task.id)}>{task.text}</span>}
            <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} />
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
