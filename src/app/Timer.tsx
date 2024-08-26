import { useEffect, useCallback } from "react";
import ticking from "./ticking";
import { Subtask, Task } from "./types";
import PomodorosRating from "./PomodorosRating";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import CircularProgressBar from "./CircularProgressBar";

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
  const intervalDuration = 20;
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
    <div className="flex flex-col items-center justify-between p-4 space-y-2 bg-white shadow-md rounded-md">
      <div className="flex flex-col space-y-2">
        <CircularProgressBar
          secondsElapsed={secondsElapsed}
          duration={intervalDuration}
          caption={`I'm focusing on ${displayedTask.name}`}
          formattedTime={formatTime(secondsElapsed)}
        >
          <PomodorosRating
            value={displayedTask.pomodoros}
            completed={displayedTask.completedPomodoros}
            mode="Display"
            className="justify-center"
            onChange={() => {}}
          ></PomodorosRating>
        </CircularProgressBar>
      </div>
      <div className="flex justify-center space-x-8">
        {isTimerRunning ? (
          <FaPause
            className={
              "text-blue-500 w-14 h-14 cursor-pointer hover:text-blue-600"
            }
            onClick={handlePause}
          ></FaPause>
        ) : (
          <FaPlay
            className={
              "text-blue-500 w-14 h-14 cursor-pointer hover:text-blue-600"
            }
            onClick={handleStart}
          ></FaPlay>
        )}
        {isTimerRunning && (
          <FaStop
            className="text-blue-500 hover:text-blue-600 w-14 h-14 cursor-pointer"
            onClick={handleVoid}
          ></FaStop>
        )}
      </div>
    </div>
  );
}
