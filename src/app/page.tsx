"use client";

import React, { useState } from "react";
import TaskManager from "./TaskManager/TaskManager";
import Timer from "./Timer/Timer";
import TabController from "./TabController";
import RecordManager from "./RecordManager";
import { Subtask, Task, TasksProvider } from "./hooks/TasksContext";

const App: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Task");
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const onTabChange = (tab: string) => {
    if (tab === "Timer") {
      if (!selectedTask && !selectedSubtask) {
        alert("Please select a task");
        return;
      }
    }
    setActiveTab(tab);
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

      <TasksProvider>
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
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                selectedSubtask={selectedSubtask}
                setSelectedSubtask={setSelectedSubtask}
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
                setSelectedTask={setSelectedTask}
                selectedSubtask={selectedSubtask}
                setSelectedSubtask={setSelectedSubtask}
              />
            )}
            {activeTab === "Record" && <RecordManager></RecordManager>}
          </div>
        </main>
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
