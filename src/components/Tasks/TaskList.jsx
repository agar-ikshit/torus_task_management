import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import TaskForm from './TaskForm';
import { ToastContainer, toast } from 'react-toastify';
import './tasklist.css';


const TaskList = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskToUpdate, setTaskToUpdate] = useState(null); // State to store the task being updated
  const [reportFormat, setReportFormat] = useState('json');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(user.email);
        const response = await axios.get('https://torus-backend-9mrl.onrender.com/api/tasks/user', {
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

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateReport = async (taskId) => {
    try {
      const response = await axios.get(`https://torus-backend-9mrl.onrender.com/api/reports/summary`, {
        params: {
          ids: taskId,
          format: reportFormat, // Use the selected format
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Summary Report:', response.data);
      toast.success("summary generated in console!");
    } catch (err) {
      console.error('Error generating report:', err.message);
      setError('Error generating report. Please try again later.');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`https://torus-backend-9mrl.onrender.com/api/tasks${taskId}`, {
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
      await axios.put(`https://torus-backend-9mrl.onrender.com/api/tasks${updatedTask._id}`, updatedTask, {
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
          <div className = "search-bar">
          <input
          
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          </div>
          <ul>
          {filteredTasks.map(task => (
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
                <br></br>
                 <label htmlFor={`reportFormat-${task._id}`}>Select Report Format:</label>
                <select
                  id={`reportFormat-${task._id}`}
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                </select>
                <br></br>
                <button onClick={() => handleGenerateReport(task._id)}>
                  Generate Task Summary Report
                </button>
                
              </li>
            ))}
          </ul>
         
          
        </>
      )}
      
    </div>
  );
};

export default TaskList;
