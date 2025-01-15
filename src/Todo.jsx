import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Todo.css"

function Todo() {
    const [tasks, setTasks] = useState ([])
    const [taskInput, setTaskInput] = useState ("")
    const [editId, setEditId] = useState ("")
    const [editValue, setEditValue] = useState ("")
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
    
    const getTasks = () => {
        axios.get(`${API_URL}/todos`)
        .then(res => {
            setTasks(res.data)
        })
        .catch(err => {
            toast.error("Failed to fetch tasks!");
        });
    }
    useEffect(() => {
        getTasks()
    }, [])

    const addTask = () => {
        let data={
            "task": taskInput,
            "isCompleted": false,
            "user": "new user"
        }
        axios.post(`${API_URL}/todos`, {task: taskInput})
        .then(res => {
            // alert("Added successfully")
            toast.success("Task added successfully!")
            setTasks([...tasks, res.data]); // Update tasks
            setTaskInput("")
        })
        .catch(err => {
            // alert("Failed to add task")
            toast.error("Failed to add task!");
            console.log(err)
        })
    }

    const inputChanged = (event) => {   
        // console.log(event.target.value)
        setTaskInput(event.target.value)
    }

    const deleteTask = (id) => {
        console.log("Deleting task with ID:", id);
        axios.delete(`${API_URL}/todos/${id}`, id)
        .then(res => {
            // alert("Task deleted successfully");
            toast.success("Task deleted successfully!");
            getTasks();  // Refresh the tasks after deletion
        })
        .catch(err => {
            console.error("Error deleting task:", err);
            toast.error("Failed to delete task!");
            // alert("Failed to delete task");
        });    
    }

    const editTask = (task) => {
        setEditId(task._id)
        setEditValue(task.task)

        // let tempTask = [...tasks]
        // tempTask[index] = prompt("Enter new task")
        // setTasks(tempTask)
    }

    const updateTask = () => {
        
        console.log("editValue:", editValue);
        axios.put(`${API_URL}/todos/`+editId, {task: editValue})
        .then(res => {
            // alert("Task updated successfully")
            toast.success("Task updated successfully!")
            setEditId("")
            setEditValue("")
            getTasks()
        })
        .catch(err => {
            toast.error("Failed to update task!");
            // alert("Failed to update task")
        })
    }
    return (
        <>
            <div className="todo-container">
                <h1 className="todo-title">Todo App</h1>
                <div className="todo-input-group">
                    <input
                        type="text"
                        className="todo-input"
                        placeholder="Add a new task"
                        onChange={inputChanged}
                    />
                    <button className="todo-add-button" onClick={addTask}>
                        Add Task
                    </button>
                </div>
                
                <ul className="todo-list">
                {tasks.map((task, index) => {
                        return (
                            <>
                                {editId === task._id ? (
                                    <div className="todo-input-group" key={index}>
                                        <input
                                            type="text"
                                            className="todo-input"
                                            value={editValue}
                                            onChange={(event) => setEditValue(event.target.value)}
                                        />
                                        <button onClick={updateTask} className="todo-edit-button1">
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <li key={index} className="todo-item">
                                        <span className="todo-task">{task.task}</span>
                                        <div className="todo-buttons">
                                            <button onClick={() => editTask(task)} className="todo-edit-button">
                                                Edit
                                            </button>
                                            <button onClick={() => deleteTask(task._id)} className="todo-delete-button">
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                )}
                            </>
                        );
                    })
                    }
                </ul>
            </div>
            <ToastContainer />
        </>
    )
}

export default Todo;