import { useState, useEffect, useCallback } from "react";
import ticking from "./ticking";
import { Subtask, Task } from "./types";
import { FaClock } from "react-icons/fa";
import PomodorosRating from "./PomodorosRating";

interface TimerProps {
  selectedTask: Task;
  selectedSubtask: Subtask;
  handleTaskPomodorosComplete: (taskId: number) => void;
  handleSubtaskPomodorosComplete: (taskId: number, subtaskId: number) => void;
}

export default function Timer({
  selectedTask,
  selectedSubtask,
  handleTaskPomodorosComplete,
  handleSubtaskPomodorosComplete,
}: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalDuration = 1;

  const displayedTask = selectedSubtask || selectedTask;

  const pomodoroSound = new Audio(ticking);
  pomodoroSound.loop = true;

  useEffect(() => {
    if (!isRunning) {
      pomodoroSound.pause();
      pomodoroSound.currentTime = 0;
      return;
    }
    pomodoroSound.play();

    let intervalCleared = false;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev === intervalDuration) {
          if (!intervalCleared) {
            clearInterval(interval);
            setIsRunning(false);
            intervalCleared = true;
            if (selectedSubtask && selectedTask) {
              handleSubtaskPomodorosComplete(
                selectedTask.id,
                selectedSubtask.id
              );
            } else if (selectedTask) {
              handleTaskPomodorosComplete(selectedTask.id);
            }
          }
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      pomodoroSound.pause();
      pomodoroSound.currentTime = 0;
    };
  }, [isRunning, intervalDuration]);

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, []);

  const handleStart = useCallback(() => {
    setIsRunning(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    pomodoroSound.pause();
  }, []);

  const handleVoid = useCallback(() => {
    if (window.confirm("Are you sure you want to void the current Pomodoro?")) {
      setIsRunning(false);
      setSeconds(0);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-between p-4 space-y-8 bg-white shadow-md rounded-md">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-center">
          <span className="text-xl font-semibold text-blue-700 mr-2">
            {selectedTask?.name}
          </span>
          {selectedSubtask?.name && (
            <span className="text-lg text-gray-500">
              &mdash; {selectedSubtask?.name}
            </span>
          )}
        </div>
        <PomodorosRating
          value={displayedTask.pomodoros || 0}
          different={displayedTask.completedPomodoros}
          showEmpty={false}
          className="justify-center"
          onChange={() => {}}
        ></PomodorosRating>
      </div>

      <h1 className="text-8xl font-bold">{formatTime(seconds)}</h1>
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 font-semibold text-white rounded-md ${
            isRunning ? "bg-red-500" : "bg-blue-500"
          }`}
          onClick={isRunning ? handlePause : handleStart}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        {isRunning && (
          <button
            className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md"
            onClick={handleVoid}
          >
            Void
          </button>
        )}
      </div>
    </div>
  );
}
