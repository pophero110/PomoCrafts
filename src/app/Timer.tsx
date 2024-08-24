import { useState, useEffect, useCallback } from "react";
import { randomUUID } from "crypto";
import ticking from "./ticking";
import { Subtask, Task } from "./types";

interface Session {
  id: string;
}

interface TimerProps {
  selectedTask: Task;
  selectedSubtask: Subtask | null;
  onHide: () => void;
}

export default function Timer({
  selectedTask,
  selectedSubtask,
  onHide,
}: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState<Session[]>([]);
  const intervalDuration = 70;

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
            setSession((prevSession) => {
              if (prevSession.length === 7) return prevSession;
              return [...prevSession, { id: randomUUID() }];
            });
            intervalCleared = true;
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
      <p>
        <span className="font-bold text-blue-600">{selectedTask.name}</span> |{" "}
        <span className="italic text-gray-600">{selectedSubtask?.name}</span>
      </p>
      <h1 className="text-4xl font-bold">{formatTime(seconds)}</h1>
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
      <button className="text-blue-500 mt-4" onClick={onHide}>
        Hide Timer
      </button>
      <div className="flex space-x-4">
        {session.map((item) => (
          <button key={item.id} aria-label="favorite" className="text-red-600">
            ❤️
          </button>
        ))}
      </div>
    </div>
  );
}
