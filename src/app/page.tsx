"use client";

import React, { useState, ChangeEvent } from "react";
import TaskManager from "./TaskManager";
import Timer from "./Timer";
import { Subtask, Task } from "./types"; // Define this type in a separate file or inline

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState<string>("");
  const [subtaskInput, setSubtaskInput] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);
  const [isTimerVisible, setIsTimerVisible] = useState<boolean>(false);

  // Function to add a new task
  const addTask = () => {
    if (taskInput.trim() === "") return;

    setTasks((prevTasks) => [
      ...prevTasks,
      { id: Date.now(), name: taskInput, subtasks: [] },
    ]);
    setTaskInput("");
  };

  // Function to delete a task
  const handleDeleteTask = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    taskId: number
  ) => {
    event.stopPropagation();
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  // Function to handle task selection
  const handleSelectTask = (taskId: number) => {
    setSelectedTask(tasks.find((task) => task.id === taskId) || null);
    if (selectedTask != null) {
      setIsTimerVisible(true);
    }
  };

  // Handle input changes
  const handleTaskInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskInput(e.target.value);
  };

  // Function to add a subtask to a selected task
  const addSubtask = (taskId: number) => {
    if (subtaskInput.trim() === "") return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                { id: Date.now(), name: subtaskInput, taskId }, // Add unique id for the subtask
              ],
            }
          : task
      )
    );
    setSubtaskInput(""); // Clear the subtask input
  };

  // Function to delete a subtask
  const handleDeleteSubtask = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    taskId: number,
    subTaskId: number
  ) => {
    event?.stopPropagation();
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter(
                (subtask) => subtask.id !== subTaskId
              ),
            }
          : task
      )
    );
  };

  const handleSelectSubtask = (taskId: number, subTaskId: number) => {
    // Find the task based on taskId
    const selectedTask = tasks.find((task) => task.id === taskId) || null;

    // If a valid task is found, find the specific subtask
    const selectedSubtask = selectedTask
      ? selectedTask.subtasks.find((subtask) => subtask.id === subTaskId) ||
        null
      : null;

    // Update state with selected task and subtask
    setSelectedTask(selectedTask);
    setSelectedSubtask(selectedSubtask);

    // Show the timer (if needed)
    if (selectedSubtask != null) {
      setIsTimerVisible(true);
    }
  };

  const handleSubtaskInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubtaskInput(e.target.value);
  };

  // Function to hide the timer
  const handleHideTimer = () => {
    setIsTimerVisible(false);
    setSelectedTask(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PomoCrafts</h1>
      <div className="flex flex-col space-y-4">
        {isTimerVisible && selectedTask !== null && (
          <Timer
            selectedTask={selectedTask}
            selectedSubtask={selectedSubtask}
            onHide={handleHideTimer}
          />
        )}
        <TaskManager
          tasks={tasks}
          taskInput={taskInput}
          subtaskInput={subtaskInput}
          selectedTask={selectedTask}
          selectedSubtask={selectedSubtask}
          addTask={addTask}
          addSubtask={addSubtask}
          handleTaskInputChange={handleTaskInputChange}
          handleSubtaskInputChange={handleSubtaskInputChange}
          handleSelectTask={handleSelectTask}
          handleDeleteTask={handleDeleteTask}
          handleSelectSubtask={handleSelectSubtask}
          handleDeleteSubtask={handleDeleteSubtask}
        />
      </div>
    </div>
  );
};

export default App;
