import { useEffect, useCallback } from "react";
import ticking from "./ticking";
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
        if (
          pomodoro.mode === "pomodoro" &&
          prev === pomodoro.durationInSeconds
        ) {
          clearInterval(interval);
          console.log("Pomodoro completed");
          handleCompletePomodoro();
          return 0;
        }
        if (
          pomodoro.mode === "shortBreak" &&
          prev === pomodoro.break.shortBreakDurationInSeconds
        ) {
          clearInterval(interval);
          console.log("Short Break completed");
          handleCompletePomodoro();
          return 0;
        }
        if (
          pomodoro.mode === "longBreak" &&
          prev === pomodoro.break.longBreakDurationInSeconds
        ) {
          clearInterval(interval);
          console.log("Long Break completed");
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
  }, [isTimerRunning, pomodoro]);

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, []);

  // Define colors based on mode
  const getModeColor = () => {
    switch (pomodoro.mode) {
      case "pomodoro":
        return "rgba(34, 197, 94, 1)"; // Green for Pomodoro
      case "shortBreak":
        return "rgba(249, 115, 22, 1)"; // Orange for Short Break
      case "longBreak":
        return "rgba(59, 130, 246, 1)"; // Blue for Long Break
      default:
        return "rgba(34, 197, 94, 1)"; // Default to Green
    }
  };

  const modeColor = getModeColor();

  return (
    <div className="flex flex-col items-center justify-between space-y-2">
      <div className="flex flex-col space-y-2">
        <CircularProgressBar
          modeColor={modeColor}
          pomodoro={pomodoro}
          secondsElapsed={secondsElapsed}
          formattedTime={formatTime(secondsElapsed)}
        ></CircularProgressBar>
      </div>
      <div className="flex justify-center space-x-8">
        {isTimerRunning ? (
          <>
            <button
              className="text-blue-500 hover:text-blue-600"
              onClick={() => {
                handleInterruptPomodoro();
                handleTickSound(false);
              }}
            >
              <FaPause className={`w-14 h-14`} />
            </button>
            <button
              className="text-blue-500 hover:text-blue-600"
              onClick={handleCancelPomodoro}
            >
              <FaStop className={`w-14 h-14`} />
            </button>
          </>
        ) : (
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={handleStartPomodoro}
            disabled={
              task.pomodorosRequired === task.pomodorosCompleted &&
              pomodoro.mode === "pomodoro"
            } // Disables button when the timer is running
          >
            <FaPlay
              className={`w-14 h-14`}
              style={{ color: modeColor }} // Apply color dynamically
            />
          </button>
        )}
      </div>
    </div>
  );
}
