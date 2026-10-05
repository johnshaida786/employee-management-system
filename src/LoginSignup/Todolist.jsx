import React, { useEffect, useState } from "react";

import {
    ChevronUp,
    ChevronDown,
    Trash2,
    Plus
} from "lucide-react";

import "../Todolist.css";


function Todolist() {

    // =====================================================
    // USER
    // =====================================================

    const loggedInUser =
        JSON.parse(localStorage.getItem("user"));


    // =====================================================
    // STATE
    // =====================================================

    const [tasks, setTasks] = useState([""]);

    const [newTask, setNewTask] = useState("");

    const [loading, setLoading] = useState(true);


    // =====================================================
    // GET TASKS FROM BACKEND
    // =====================================================

    useEffect(() => {

        if (!loggedInUser?.id) {
            setLoading(false);
            return;
        }

        fetch(
            `http://localhost:5000/tasks/${loggedInUser.id}`
        )
            .then((response) => {

                if (!response.ok) {
                    throw new Error("Failed to fetch tasks");
                }

                return response.json();
            })
            .then((data) => {

                setTasks(data.tasks || []);

            })
            .catch((error) => {

                console.error(
                    "Error loading tasks:",
                    error
                );

            })
            .finally(() => {

                setLoading(false);

            });

    }, [loggedInUser?.id]);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    function handleInputChange(event) {

        setNewTask(event.target.value);

    }


    // =====================================================
    // ADD TASK
    // =====================================================

    async function addTask() {

        const taskText = newTask.trim();


        if (taskText === "") {
            return;
        }


        if (!loggedInUser?.id) {

            alert("Please login first.");

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/tasks",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userId: loggedInUser.id,
                        task: taskText
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Failed to add task"
                );

            }


            // Add returned task to React state
            setTasks((currentTasks) => [
                ...currentTasks,
                data.task
            ]);


            setNewTask("");

        }
        catch (error) {

            console.error(
                "Add task error:",
                error
            );

            alert("Failed to add task.");

        }

    }


    // =====================================================
    // DELETE TASK
    // =====================================================

    async function deleteTask(taskId) {

        try {

            const response = await fetch(
                `http://localhost:5000/tasks/${taskId}`,
                {
                    method: "DELETE"
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Failed to delete task"
                );

            }


            setTasks((currentTasks) =>
                currentTasks.filter(
                    (task) => task.id !== taskId
                )
            );

        }
        catch (error) {

            console.error(
                "Delete task error:",
                error
            );

            alert("Failed to delete task.");

        }

    }


    // =====================================================
    // SAVE TASK ORDER
    // =====================================================

    async function saveTaskOrder(updatedTasks) {

        if (!loggedInUser?.id) {
            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/tasks/reorder",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userId: loggedInUser.id,
                        tasks: updatedTasks
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to save task order"
                );

            }

        }
        catch (error) {

            console.error(
                "Save task order error:",
                error
            );

        }

    }


    // =====================================================
    // MOVE TASK UP
    // =====================================================

    async function moveTaskUp(index) {

        if (index === 0) {
            return;
        }


        const updatedTasks = [...tasks];


        [
            updatedTasks[index],
            updatedTasks[index - 1]
        ] =
        [
            updatedTasks[index - 1],
            updatedTasks[index]
        ];


        setTasks(updatedTasks);


        await saveTaskOrder(updatedTasks);

    }


    // =====================================================
    // MOVE TASK DOWN
    // =====================================================

    async function moveTaskDown(index) {

        if (index >= tasks.length - 1) {
            return;
        }


        const updatedTasks = [...tasks];


        [
            updatedTasks[index],
            updatedTasks[index + 1]
        ] =
        [
            updatedTasks[index + 1],
            updatedTasks[index]
        ];


        setTasks(updatedTasks);


        await saveTaskOrder(updatedTasks);

    }


    // =====================================================
    // ENTER KEY
    // =====================================================

    function handleKeyDown(event) {

        if (event.key === "Enter") {

            addTask();

        }

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="to-do-list">

                <div className="tasks-loading">
                    Loading your tasks...
                </div>

            </div>
        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="to-do-list">


            {/* ADD TASK */}

            <div className="task-input-container">

                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />


                <button
                    type="button"
                    className="add-button"
                    onClick={addTask}
                >

                    <Plus size={18} />

                    <span>
                        Add
                    </span>

                </button>

            </div>


            {/* TASK LIST */}

            <ol className="task-list">

                {tasks.length === 0 ? (

                    <li className="empty-task">

                        <span>
                            No tasks yet. Add your first task.
                        </span>

                    </li>

                ) : (

                    tasks.map((task, index) => (

                        <li
                            key={task.id}
                            className="task-item"
                        >


                            {/* TASK TEXT */}

                            <span className="text">
                                {task.task}
                            </span>


                            {/* ACTIONS */}

                            <div className="task-actions">


                                {/* DELETE */}

                                <button
                                    type="button"
                                    className="delete-button"
                                    onClick={() =>
                                        deleteTask(task.id)
                                    }
                                    title="Delete task"
                                >

                                    <Trash2 size={16} />

                                    <span>
                                        Delete
                                    </span>

                                </button>


                                {/* UP */}

                                <button
                                    type="button"
                                    className="move-button"
                                    onClick={() =>
                                        moveTaskUp(index)
                                    }
                                    disabled={index === 0}
                                    title="Move task up"
                                >

                                    <ChevronUp size={18} />

                                </button>


                                {/* DOWN */}

                                <button
                                    type="button"
                                    className="move-button"
                                    onClick={() =>
                                        moveTaskDown(index)
                                    }
                                    disabled={
                                        index === tasks.length - 1
                                    }
                                    title="Move task down"
                                >

                                    <ChevronDown size={18} />

                                </button>


                            </div>

                        </li>

                    ))

                )}

            </ol>

        </div>

    );

}


export default Todolist;