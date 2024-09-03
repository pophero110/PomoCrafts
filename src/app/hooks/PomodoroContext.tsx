import React, { createContext, useContext, useState, ReactNode } from "react";

// Interfaces
export interface Break {
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

export interface Pomodoro {
  workDuration: number;
  pomodorosCompleted: number;
  break: Break;
}

// Context State Interface
interface PomodoroContextState {
  pomodoro: Pomodoro;
  setPomodoro: React.Dispatch<React.SetStateAction<Pomodoro>>;
}

// Initial State
const initialPomodoro: Pomodoro = {
  workDuration: 25, // default work duration in minutes
  pomodorosCompleted: 0,
  break: {
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
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
