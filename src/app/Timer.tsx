import { useEffect, useCallback } from "react";
import ticking from "./ticking";
import { Subtask, Task } from "./types";
import PomodorosRating from "./PomodorosRating";

interface TimerProps {
  secondsElapsed: number;
  setSecondsElapsed: React.Dispatch<React.SetStateAction<number>>;
  isTimerRunning: boolean;
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTask: Task;
  selectedSubtask: Subtask | null;
  handleTaskPomodorosComplete: (taskId: number) => void;
  handleSubtaskPomodorosComplete: (taskId: number, subtaskId: number) => void;
}

export default function Timer({
  secondsElapsed,
  setSecondsElapsed,
  isTimerRunning,
  setIsTimerRunning,
  selectedTask,
  selectedSubtask,
  handleTaskPomodorosComplete,
  handleSubtaskPomodorosComplete,
}: TimerProps) {
  const intervalDuration = 1;
  const displayedTask = selectedSubtask || selectedTask;

  const pomodoroSound = new Audio(ticking);
  pomodoroSound.loop = true;

  useEffect(() => {
    if (!isTimerRunning) {
      pomodoroSound.pause();
      pomodoroSound.currentTime = 0;
      return;
    }
    pomodoroSound.play();

    let intervalCleared = false;

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => {
        if (prev === intervalDuration) {
          if (!intervalCleared) {
            clearInterval(interval);
            setIsTimerRunning(false);
            intervalCleared = true;
            if (selectedSubtask != null) {
              handleSubtaskPomodorosComplete(
                selectedTask.id,
                selectedSubtask.id
              );
            } else if (selectedTask != null) {
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
  }, [isTimerRunning, intervalDuration]);

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, []);

  const handleStart = useCallback(() => {
    if (selectedTask.pomodoros === selectedTask.completedPomodoros) {
      alert("Task is completed");
      return;
    }
    if (
      selectedSubtask != null &&
      selectedSubtask.pomodoros === selectedSubtask.completedPomodoros
    ) {
      alert("Task is completed");
      return;
    }
    setIsTimerRunning(true);
  }, [selectedTask, selectedSubtask]);

  const handlePause = useCallback(() => {
    setIsTimerRunning(false);
    pomodoroSound.pause();
  }, []);

  const handleVoid = useCallback(() => {
    if (window.confirm("Are you sure you want to void the current Pomodoro?")) {
      setIsTimerRunning(false);
      setSecondsElapsed(0);
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
          value={displayedTask.pomodoros}
          completed={displayedTask.completedPomodoros}
          mode="Display"
          className="justify-center"
          onChange={() => {}}
        ></PomodorosRating>
      </div>

      <h1 className="text-8xl font-bold">{formatTime(secondsElapsed)}</h1>
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 font-semibold text-white rounded-md ${
            isTimerRunning ? "bg-red-500" : "bg-blue-500"
          }`}
          onClick={isTimerRunning ? handlePause : handleStart}
        >
          {isTimerRunning ? "Pause" : "Start"}
        </button>
        {isTimerRunning && (
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
