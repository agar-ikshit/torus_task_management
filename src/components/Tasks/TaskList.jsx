import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import TaskForm from './TaskForm';
import { ToastContainer, toast } from 'react-toastify';

const TaskList = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskToUpdate, setTaskToUpdate] = useState(null); // State to store the task being updated

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(user.email);
        const response = await axios.get('http://localhost:5000/api/tasks/user', {
          params: { email: user.email },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTasks(response.data);
      } catch (err) {
        setError('Error fetching tasks. Please try again later.');
        console.error('Error fetching tasks:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user.email) {
      fetchTasks();
    }
  }, [refresh, user.email]);

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRefresh(prev => !prev);
      toast.success('Task deleted successfully!');
    } catch (err) {
      console.error('Error deleting task:', err.message);
      setError('Error deleting task. Please try again later.');
      if (err.response && err.response.status === 401) {
        toast.error('User not authorized');
      }
      toast.error('Error deleting task. Please try again later.');
    }
  };

  const handleUpdate = (task) => {
    setTaskToUpdate(task); // Set the task to be updated
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${updatedTask._id}`, updatedTask, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRefresh(prev => !prev);
      setTaskToUpdate(null); // Clear the task being updated
      toast.success('Task updated successfully!');
    } catch (err) {
      console.error('Error updating task:', err.message);
      setError('Error updating task. Please try again later.');
      if (err.response && err.response.status === 401) {
        toast.error('User not authorized');
      }
      toast.error('Error updating task. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Your Tasks</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <TaskForm
            setRefresh={setRefresh}
            taskToUpdate={taskToUpdate}
            onUpdateTask={handleUpdateTask}
            user={user} // Pass user to TaskForm
          />
          <ul>
            {tasks.map(task => (
              <li key={task._id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                <p>Status: {task.status}</p>
                <p>Priority: {task.priority}</p>
                <p>Assigned User: {task.assignedUser ? task.assignedUser.email : 'Not assigned'}</p>
                <p>Created By: {task.createdBy ? task.createdBy.email : 'Unknown'}</p>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
                {user.isAdmin && ( // Only show the update button if the user is an admin
                  <button onClick={() => handleUpdate(task)}>Update</button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      
    </div>
  );
};

export default TaskList;