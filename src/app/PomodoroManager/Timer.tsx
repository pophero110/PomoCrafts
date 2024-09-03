import { useEffect, useCallback } from "react";
import ticking from "./ticking";
import PomodorosRating from "../PomodorosRating";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import CircularProgressBar from "./CircularProgressBar";
import { Subtask, Task } from "../hooks/TasksContext";
import { Pomodoro } from "../hooks/PomodoroContext";

interface TimerProps {
  pomodoro: Pomodoro;
  task: Task | Subtask;
  secondsElapsed: number;
  setSecondsElapsed: React.Dispatch<React.SetStateAction<number>>;
  handleCompletePomodoro: () => void;
  handleStartPomodoro: () => void;
  handleInterruptPomodoro: () => void;
  handleCancelPomodoro: () => void;
  isTimerRunning: boolean;
}

export default function Timer({
  pomodoro,
  task,
  secondsElapsed,
  setSecondsElapsed,
  handleStartPomodoro,
  handleCancelPomodoro,
  handleCompletePomodoro,
  handleInterruptPomodoro,
  isTimerRunning,
}: TimerProps) {
  const pomodoroSound = new Audio(ticking);
  pomodoroSound.loop = true;

  const handleTickSound = (play: boolean) => {
    if (play) {
      pomodoroSound.play();
    } else {
      pomodoroSound.pause();
      pomodoroSound.currentTime = 0;
    }
  };

  useEffect(() => {
    handleTickSound(isTimerRunning);

    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => {
        if (prev >= pomodoro.durationInSeconds) {
          clearInterval(interval);
          handleCompletePomodoro();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      handleTickSound(false);
    };
  }, [isTimerRunning, task, pomodoro]);

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, []);

  return (
    <div className="flex flex-col items-center justify-between space-y-2">
      <div className="flex flex-col space-y-2">
        <CircularProgressBar
          secondsElapsed={secondsElapsed}
          duration={pomodoro.durationInSeconds}
          formattedTime={formatTime(secondsElapsed)}
        ></CircularProgressBar>
      </div>
      <div className="flex justify-center space-x-8">
        {isTimerRunning ? (
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={() => {
              handleInterruptPomodoro();
              handleTickSound(false);
            }}
          >
            <FaPause className={`w-14 h-14`} />
          </button>
        ) : (
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={handleStartPomodoro}
            disabled={task.pomodorosRequired === task.pomodorosCompleted} // Disables button when the timer is running
          >
            <FaPlay
              className={`w-14 h-14 ${
                task.pomodorosRequired === task.pomodorosCompleted
                  ? "text-gray-500"
                  : ""
              }`}
            />
          </button>
        )}
        {isTimerRunning && (
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={handleCancelPomodoro}
          >
            <FaStop className={`w-14 h-14`} />
          </button>
        )}
      </div>
    </div>
  );
}
