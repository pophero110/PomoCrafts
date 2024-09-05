"use client";

import React, { useState } from "react";
import TaskManager from "./TaskManager/TaskManager";
import TabController from "./TabController";
import RecordManager from "./RecordManager";
import { Subtask, Task, TasksProvider } from "./hooks/TasksContext";
import { PomodoroProvider } from "./hooks/PomodoroContext";
import PomodorosManager from "./PomodoroManager/PomodoroManager";

export type Tab = "Task" | "Pomodoro" | "Record";

const App: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Task");

  const onTabChange = (tab: Tab) => {
    if (tab === "Pomodoro") {
      if (!selectedTask && !selectedSubtask) {
        alert("Please select a task");
        return;
      }
    }
    setActiveTab(tab);
  };

  const startTimer = () => {
    setActiveTab("Pomodoro");
  };

  return (
    <div className="min-h-screen flex flex-col overflow-y-auto">
      {/* Header */}
      {/* <header className="bg-gray-800 text-white py-2">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">PomoCrafts</h1>
        </div>
      </header> */}

      <TasksProvider>
        <PomodoroProvider>
          {/* Main Content Area */}
          <main className="container mx-auto p-2">
            {/* Tab Controller */}
            <TabController
              tabs={["Task", "Pomodoro", "Record"]}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />

            {/* Dynamic Content Based on Active Tab */}
            <div className="mt-6">
              {activeTab === "Task" && (
                <TaskManager
                  selectedTask={selectedTask}
                  setSelectedTask={setSelectedTask}
                  selectedSubtask={selectedSubtask}
                  setSelectedSubtask={setSelectedSubtask}
                  startTimer={startTimer}
                />
              )}
              {activeTab === "Pomodoro" && (
                <PomodorosManager
                  selectedTask={selectedTask as Task} // a task must be selected
                  setSelectedTask={setSelectedTask}
                  selectedSubtask={selectedSubtask}
                  setSelectedSubtask={setSelectedSubtask}
                  setActiveTab={setActiveTab}
                ></PomodorosManager>
                // <Timer
                //   secondsElapsed={secondsElapsed}
                //   setSecondsElapsed={setSecondsElapsed}
                //   isTimerRunning={isTimerRunning}
                //   setIsTimerRunning={setIsTimerRunning}
                //   selectedTask={selectedTask as Task} // a task must be selected
                //   setSelectedTask={setSelectedTask}
                //   selectedSubtask={selectedSubtask}
                //   setSelectedSubtask={setSelectedSubtask}
                //   setActiveTab={setActiveTab}
                // />
              )}
              {activeTab === "Record" && <RecordManager></RecordManager>}
            </div>
          </main>
        </PomodoroProvider>
      </TasksProvider>

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
