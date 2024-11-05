import React, { useState } from "react";
import "./App.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isEditing, setIsEditing] = useState(null);

  // Add new task
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  // Edit task
  const editTask = (id, newText) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text: newText } : task)));
    setIsEditing(null);
  };

  // Delete task with confirmation alert
  const deleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    const confirmDelete = window.confirm(`Are you sure you want to delete the task: "${taskToDelete.text}"?`);

    if (confirmDelete) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // Drag and Drop (if needed for future)
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <div className="add-task">
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter a new task" />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((task, index) => (
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
