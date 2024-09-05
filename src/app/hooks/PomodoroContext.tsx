import React, { createContext, useContext, useState, ReactNode } from "react";

// Interfaces
export interface Break {
  shortBreakDurationInSeconds: number;
  longBreakDurationInSeconds: number;
  longBreakInterval: number;
  breakCompleted: number;
}

export interface Pomodoro {
  durationInSeconds: number;
  pomodorosCompleted: number;
  break: Break;
  mode: "pomodoro" | "shortBreak" | "longBreak";
}

// Context State Interface
interface PomodoroContextState {
  pomodoro: Pomodoro;
  setPomodoro: React.Dispatch<React.SetStateAction<Pomodoro>>;
}

// Initial State
const initialPomodoro: Pomodoro = {
  durationInSeconds: 3,
  pomodorosCompleted: 0,
  mode: "pomodoro",
  break: {
    shortBreakDurationInSeconds: 3,
    longBreakDurationInSeconds: 3,
    longBreakInterval: 4,
    breakCompleted: 0,
  },
};

// Create Context
const PomodoroContext = createContext<PomodoroContextState | undefined>(
  undefined
);

// Provider Component
export const PomodoroProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pomodoro, setPomodoro] = useState<Pomodoro>(initialPomodoro);

  return (
    <PomodoroContext.Provider value={{ pomodoro, setPomodoro }}>
      {children}
    </PomodoroContext.Provider>
  );
};

// Custom Hook
export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return context;
};
