import React, { useState, useCallback } from "react";
import Timer from "./Timer";
import { Task, Subtask, useTasks } from "../hooks/TasksContext";
import { Tab } from "../page";
import { usePomodoro } from "../hooks/PomodoroContext";

interface PomodorosManagerProps {
  selectedTask: Task;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  selectedSubtask: Subtask | null;
  setSelectedSubtask: React.Dispatch<React.SetStateAction<Subtask | null>>;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const PomodorosManager: React.FC<PomodorosManagerProps> = ({
  selectedTask,
  setSelectedTask,
  selectedSubtask,
  setSelectedSubtask,
}) => {
  const { pomodoro } = usePomodoro();
  const { tasks } = useTasks();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100">
      {selectedTask && (
        <Timer
          secondsElapsed={secondsElapsed}
          setSecondsElapsed={setSecondsElapsed}
          isTimerRunning={isTimerRunning}
          setIsTimerRunning={setIsTimerRunning}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          selectedSubtask={selectedSubtask}
          setSelectedSubtask={setSelectedSubtask}
        />
      )}
    </div>
  );
};

export default PomodorosManager;
