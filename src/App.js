import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === '') {
      alert('Task cannot be empty');
      return;
    }
    if (tasks.some(task => task.text === newTask)) {
      alert('Task already exists');
      return;
    }
    setTasks([...tasks, { text: newTask, description: newDescription, completed: false, inProgress: false }]);
    setNewTask('');
    setNewDescription('');
  };

  const toggleTask = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) => {
        if (i === index) {
          if (!task.inProgress && !task.completed) {
            return { ...task, inProgress: true };
          } else if (task.inProgress && !task.completed) {
            return { ...task, inProgress: false, completed: true };
          } else {
            return { ...task, completed: false };
          }
        }
        return task;
      })
    );
  };

  const deleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const clearCompletedTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  const startEditing = (index, text, description) => {
    setEditIndex(index);
    setEditText(text);
    setEditDescription(description);
  };

  const saveEdit = () => {
    if (editText.trim() === '') {
      alert('Task cannot be empty');
      return;
    }
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === editIndex ? { ...task, text: editText, description: editDescription } : task
      )
    );
    setEditIndex(null);
    setEditText('');
    setEditDescription('');
  };

  const todoTasks = tasks.filter(task => !task.inProgress && !task.completed);
  const inProgressTasks = tasks.filter(task => task.inProgress && !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="App">
      <div className="todo-container">
        <h1>TODO-LIST</h1>

        {/* Input Section */}
        <div className="input-section">
          <input
            type="text"
            placeholder="Task title..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <textarea
            placeholder="Task description..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>

        <div className="task-box-container">
          {/* TODO Section */}
          <div className="task-box">
            <h2>TODO</h2>
            <ul className="task-list">
              {todoTasks.map((task, index) => (
                <li key={index}>
                  {editIndex === index ? (
                    <div className="edit-section">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <button onClick={saveEdit}>Save</button>
                    </div>
                  ) : (
                    <div className="task-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(index)}
                        />
                        <span>{task.text}</span>
                      </label>
                      <p>{task.description}</p>
                      <div>
                        <button onClick={() => startEditing(index, task.text, task.description)}>
                          Edit
                        </button>
                        <button onClick={() => deleteTask(index)}>Delete</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* In-Progress Section */}
          <div className="task-box">
            <h2>In-Progress</h2>
            <ul className="task-list">
              {inProgressTasks.map((task, index) => (
                <li key={index}>
                  <div className="task-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(index)}
                      />
                      <span>{task.text}</span>
                    </label>
                    <p>{task.description}</p>
                    <div>
                      <button onClick={() => startEditing(index, task.text, task.description)}>
                        Edit
                      </button>
                      <button onClick={() => deleteTask(index)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Completed Section */}
          <div className="task-box">
            <h2>Completed</h2>
            <ul className="task-list">
              {completedTasks.map((task, index) => (
                <li key={index}>
                  <div className="task-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(index)}
                      />
                      <span>{task.text}</span>
                    </label>
                    <p>{task.description}</p>
                    <div>
                      <button onClick={() => startEditing(index, task.text, task.description)}>
                        Edit
                      </button>
                      <button onClick={() => deleteTask(index)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Clear Completed Button */}
        <button onClick={clearCompletedTasks} className="clear-completed-button">
          Clear Completed
        </button>
      </div>
    </div>
  );
}

export default App;