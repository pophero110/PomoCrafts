import { useEffect, useCallback } from "react";
import ticking from "./ticking";
import PomodorosRating from "../PomodorosRating";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import CircularProgressBar from "./CircularProgressBar";
import { Subtask, Task, useTasks } from "../hooks/TasksContext";
import { Tab } from "../page";

interface TimerProps {
  secondsElapsed: number;
  setSecondsElapsed: React.Dispatch<React.SetStateAction<number>>;
  isTimerRunning: boolean;
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTask: Task;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  selectedSubtask: Subtask | null;
  setSelectedSubtask: React.Dispatch<React.SetStateAction<Subtask | null>>;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
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
  setActiveTab,
}: TimerProps) {
  const { updateTask, updateSubtask } = useTasks();
  const intervalDuration = 3;
  const displayedTask = selectedSubtask || selectedTask;

  const pomodoroSound = new Audio(ticking);
  pomodoroSound.loop = true;

  const handleSound = (play: boolean) => {
    if (play) {
      pomodoroSound.play();
    } else {
      pomodoroSound.pause();
      pomodoroSound.currentTime = 0;
    }
  };

  const handleCompletion = useCallback(
    (type: "task" | "subtask") => {
      if (type === "task" && selectedTask) {
        const updatedTask = {
          ...selectedTask,
          completedPomodoros: selectedTask.completedPomodoros + 1,
        };
        updateTask(updatedTask);
        setSelectedTask(updatedTask);
      } else if (type === "subtask" && selectedSubtask) {
        const updatedSubtask = {
          ...selectedSubtask,
          completedPomodoros: selectedSubtask.completedPomodoros + 1,
        };
        updateSubtask(updatedSubtask);
        setSelectedSubtask(updatedSubtask);
      }
    },
    [selectedTask, selectedSubtask, updateTask, updateSubtask]
  );

  useEffect(() => {
    const handleTimerComplete = () => {
      setIsTimerRunning(false);
      if (selectedSubtask) {
        handleCompletion("subtask");
      } else if (selectedTask) {
        handleCompletion("task");
      }
    };

    handleSound(isTimerRunning);

    if (!isTimerRunning) return;

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
      handleSound(false);
    };
  }, [
    isTimerRunning,
    intervalDuration,
    selectedTask,
    selectedSubtask,
    handleCompletion,
  ]);

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, []);

  const handleStart = useCallback(() => {
    if (
      !selectedTask ||
      selectedTask.pomodoros === selectedTask.completedPomodoros ||
      (selectedSubtask &&
        selectedSubtask.pomodoros === selectedSubtask.completedPomodoros)
    ) {
      alert("Task or subtask is completed");
      return;
    }
    setIsTimerRunning(true);
  }, [selectedTask, selectedSubtask]);

  const handlePause = useCallback(() => {
    setIsTimerRunning(false);
    handleSound(false);
  }, []);

  const handleCancel = useCallback(() => {
    if (
      window.confirm("Are you sure you want to cancel the current Pomodoro?")
    ) {
      setIsTimerRunning(false);
      setSecondsElapsed(0);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-between p-4 space-y-2 bg-white shadow-md rounded-md">
      <button onClick={() => setActiveTab("Task")}>X</button>
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
            className="text-blue-500 w-14 h-14 cursor-pointer hover:text-blue-600"
            onClick={handlePause}
          />
        ) : (
          <FaPlay
            className="text-blue-500 w-14 h-14 cursor-pointer hover:text-blue-600"
            onClick={handleStart}
          />
        )}
        {isTimerRunning && (
          <FaStop
            className="text-blue-500 hover:text-blue-600 w-14 h-14 cursor-pointer"
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
