"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import TaskManager from "./TaskManager";
import Timer from "./Timer";
import { Subtask, Task } from "./types"; // Define this type in a separate file or inline
import TabController from "./TabController";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState<string>("");
  const [pomodoros, setPomodoros] = useState<number>(1);
  const [subtaskInput, setSubtaskInput] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Task");
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Function to add a new task
  const addTask = () => {
    if (taskInput.trim() === "") return;

    const lines = taskInput.split("\n");
    const mainTask = lines[0]; // The first line is the main task

    let task: Task = {
      id: Date.now(),
      name: mainTask.trim(),
      pomodoros,
      completedPomodoros: 0,
      subtasks: [],
    };

    // Split the input into lines
    const subtasks = lines
      .slice(1)
      .filter(
        (line) =>
          line.trim().startsWith("-") ||
          line.trim().startsWith("*") ||
          line.trim().startsWith("•")
      )
      .map((line, index) => ({
        id: index + 1, // Subtask IDs can be index-based or generated differently
        taskId: task.id, // Associate each subtask with the main task's ID
        name: line.trim().slice(1).trim(), // Remove the bullet point and any leading/trailing whitespace
        pomodoros: 1,
        completedPomodoros: 0,
      }));

    task.subtasks = subtasks;

    setTasks((prevTasks) => [...prevTasks, task]);
    setTaskInput("");
    setSelectedTask(task);
    if (task.subtasks.length != 0) {
      setSelectedSubtask(task.subtasks[0]);
    }
  };

  const handlePomodorosInput = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    pomodoros: number
  ) => {
    event.stopPropagation();
    setPomodoros(pomodoros);
  };

  const handleTaskPomodorosChange = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    taskId: number,
    pomodoros: number
  ) => {
    event?.stopPropagation();
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task, pomodoros };
          const isSelectedTask = selectedTask?.id === taskId;
          if (isSelectedTask) {
            setSelectedTask(updatedTask);
          }
          return updatedTask;
        }
        return task;
      })
    );
  };

  const handleSubtaskPomodorosChange = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    taskId: number,
    subtaskId: number,
    pomodoros: number
  ) => {
    event.stopPropagation();
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) => {
                if (subtask.id === subtaskId) {
                  const updatedSubtask = { ...subtask, pomodoros };
                  const isSelectedSubtask = selectedSubtask?.id === subtaskId;
                  if (isSelectedSubtask) {
                    setSelectedSubtask(updatedSubtask);
                  }
                  return updatedSubtask;
                }
                return subtask;
              }),
            }
          : task
      )
    );
  };

  // Function to delete a task
  const handleDeleteTask = (event: React.MouseEvent, taskId: number) => {
    event.stopPropagation();

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== taskId);
      return updatedTasks;
    });
    // Check if the deleted task is the currently selected task
    const isSelectedTask = selectedTask?.id === taskId;

    // Update selected task and subtask if the deleted task was selected
    if (isSelectedTask) {
      setSelectedTask(null);
      setSelectedSubtask(null);
    }
  };

  // Function to handle task selection
  const handleSelectTask = (taskId: number) => {
    setSelectedTask(
      tasks.find((task) => {
        if (task.id === taskId) {
          if (task.subtasks.length != 0) {
            setSelectedSubtask(task.subtasks[0]);
          }
          return true;
        }
        return false;
      }) || null
    );
  };

  // Handle input changes
  const handleTaskInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
                {
                  id: Date.now(),
                  name: subtaskInput,
                  taskId,
                  pomodoros: 1,
                  completedPomodoros: 0,
                }, // Add unique id for the subtask
              ],
            }
          : task
      )
    );
    setSubtaskInput(""); // Clear the subtask input
  };

  // Function to delete a subtask
  const handleDeleteSubtask = (
    event: React.MouseEvent,
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

    const isSelectedSubtask = selectedSubtask?.id === subTaskId;

    if (isSelectedSubtask) {
      setSelectedSubtask(null);
    }
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
  };

  const handleSubtaskInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubtaskInput(e.target.value);
  };

  const onTabChange = (tab: string) => {
    if (tab === "Timer") {
      if (!selectedTask && !selectedSubtask) {
        alert("Please select a task");
        return;
      }
    }
    setActiveTab(tab);
  };

  const handleTaskPomodorosComplete = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            completedPomodoros: task.completedPomodoros + 1,
          };
          const isSelectedTask = selectedTask?.id === taskId;
          if (isSelectedTask) {
            setSelectedTask(updatedTask);
          }
          return updatedTask;
        }
        return task;
      })
    );
  };

  const handleSubtaskPomodorosComplete = (
    taskId: number,
    subtaskId: number
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) => {
                if (subtask.id === subtaskId) {
                  const updatedSubtask = {
                    ...subtask,
                    completedPomodoros: subtask.completedPomodoros + 1,
                  };
                  const isSelectedSubtask = selectedSubtask?.id === subtaskId;
                  if (isSelectedSubtask) {
                    setSelectedSubtask(updatedSubtask);
                  }
                  return updatedSubtask;
                }
                return subtask;
              }),
            }
          : task
      )
    );
  };

  const startTimer = () => {
    setActiveTab("Timer");
    setIsTimerRunning(true);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-y-auto">
      {/* Header */}
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">PomoCrafts</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto flex-grow p-4">
        {/* Tab Controller */}
        <TabController
          tabs={["Task", "Timer", "Record"]}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />

        {/* Dynamic Content Based on Active Tab */}
        <div className="mt-6">
          {activeTab === "Task" && (
            <TaskManager
              tasks={tasks}
              taskInput={taskInput}
              pomodoros={pomodoros}
              handlePomodorosInput={handlePomodorosInput}
              handleTaskPomodorosChange={handleTaskPomodorosChange}
              handleSubtaskPomodorosChange={handleSubtaskPomodorosChange}
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
              startTimer={startTimer}
            />
          )}
          {activeTab === "Timer" && (
            <Timer
              secondsElapsed={secondsElapsed}
              setSecondsElapsed={setSecondsElapsed}
              isTimerRunning={isTimerRunning}
              setIsTimerRunning={setIsTimerRunning}
              selectedTask={selectedTask as Task} // a task must be selected
              selectedSubtask={selectedSubtask}
              handleTaskPomodorosComplete={handleTaskPomodorosComplete}
              handleSubtaskPomodorosComplete={handleSubtaskPomodorosComplete}
            />
          )}
          {activeTab === "Record" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Record</h2>
              {/* Placeholder for Record content */}
              <p className="text-gray-700">Record content goes here...</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; 2024 PomoCrafts. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
