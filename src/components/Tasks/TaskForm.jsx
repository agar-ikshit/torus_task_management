// TaskForm.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const TaskForm = ({ setRefresh, taskToUpdate, onUpdateTask, user }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do',
    assignedUser: '',
    priority: 'Medium',
  });

  useEffect(() => {
    if (taskToUpdate) {
      setTask({
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        dueDate: taskToUpdate.dueDate.split('T')[0], // Format date for input
        status: taskToUpdate.status,
        assignedUser: taskToUpdate.assignedUser ? taskToUpdate.assignedUser.email : '',
        priority: taskToUpdate.priority,
      });
    }
  }, [taskToUpdate]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (taskToUpdate) {
        await onUpdateTask({ ...task, _id: taskToUpdate._id }); // Pass the task ID
      } else {
        await axios.post("https://torus-backend-9mrl.onrender.com/api/tasks", task, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('Task created successfully!');
        setTask({ title: '', description: '', dueDate: '', status: 'To Do', assignedUser: '', priority: 'Medium' });
        setRefresh(prev => !prev);
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error('Error submitting task. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
        value={task.title}
        required
      />
      <input
        name="description"
        placeholder="Description"
        onChange={handleChange}
        value={task.description}
      />
      <input
        name="dueDate"
        type="date"
        onChange={handleChange}
        value={task.dueDate}
        required
      />
      <select name="status" onChange={handleChange} value={task.status}>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <select name="priority" onChange={handleChange} value={task.priority}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      {user?.isAdmin && (
        <input
          name="assignedUser"
          placeholder="Assigned User"
          onChange={handleChange}
          value={task.assignedUser}
          required
        />
      )}

      <button type="submit">{taskToUpdate ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;
