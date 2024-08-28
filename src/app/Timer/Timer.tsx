import { useEffect, useCallback } from "react";
import ticking from "./ticking";
import PomodorosRating from "../PomodorosRating";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import CircularProgressBar from "./CircularProgressBar";
import { Subtask, Task, useTasks } from "../hooks/TasksContext";

interface TimerProps {
  secondsElapsed: number;
  setSecondsElapsed: React.Dispatch<React.SetStateAction<number>>;
  isTimerRunning: boolean;
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTask: Task;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  selectedSubtask: Subtask | null;
  setSelectedSubtask: React.Dispatch<React.SetStateAction<Subtask | null>>;
}

export default function Timer({
  secondsElapsed,
  setSecondsElapsed,
  isTimerRunning,
  setIsTimerRunning,
  selectedTask,
  setSelectedTask,
  selectedSubtask,
  setSelectedSubtask,
}: TimerProps) {
  const { findTask, updateTask, findSubtask, updateSubtask } = useTasks();
  const intervalDuration = 3;
  const displayedTask = selectedSubtask || selectedTask;

  const pomodoroSound = new Audio(ticking);
  pomodoroSound.loop = true;

  useEffect(() => {
    const handleTimerComplete = () => {
      setIsTimerRunning(false);
      if (selectedSubtask) {
        handleSubtaskPomodorosComplete(selectedSubtask.id);
      } else if (selectedTask) {
        handleTaskPomodorosComplete(selectedTask.id);
      }
    };

    if (isTimerRunning) {
      pomodoroSound.play();
    } else {
      pomodoroSound.pause();
      pomodoroSound.currentTime = 0;
      return;
    }

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => {
        if (prev >= intervalDuration) {
          clearInterval(interval);
          handleTimerComplete();
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
  }, [isTimerRunning, intervalDuration, selectedTask, selectedSubtask]);

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

  const handleCancel = useCallback(() => {
    if (
      window.confirm("Are you sure you want to cancel the current Pomodoro?")
    ) {
      setIsTimerRunning(false);
      setSecondsElapsed(0);
    }
  }, []);

  const handleTaskPomodorosComplete = (taskId: number) => {
    const task = findTask(taskId);
    if (task) {
      const updatedTask = {
        ...task,
        completedPomodoros: task.completedPomodoros + 1,
      };
      updateTask(updatedTask);
      const isCurrentTaskSelected = selectedTask?.id === taskId;
      if (isCurrentTaskSelected) {
        setSelectedTask(updatedTask);
      }
    }
  };

  const handleSubtaskPomodorosComplete = (subtaskId: number) => {
    const subtask = findSubtask(subtaskId);
    if (subtask) {
      const updatedSubtask = {
        ...subtask,
        completedPomodoros: subtask.completedPomodoros + 1,
      };
      updateSubtask(updatedSubtask);

      const isCurrentSubtaskSelected = selectedSubtask?.id === subtaskId;
      if (isCurrentSubtaskSelected) {
        setSelectedSubtask(updatedSubtask);
      }
    }
  };

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
            onClick={handleCancel}
          ></FaStop>
        )}
      </div>
    </div>
  );
}
