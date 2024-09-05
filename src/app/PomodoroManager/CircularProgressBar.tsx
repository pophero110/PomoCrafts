import React from "react";
import { Pomodoro } from "../hooks/PomodoroContext";

interface CircularProgressBarProps {
  pomodoro: Pomodoro;
  modeColor:
    | "rgba(34, 197, 94, 1)"
    | "rgba(249, 115, 22, 1)"
    | "rgba(59, 130, 246, 1)";
  secondsElapsed: number;
  formattedTime: string; // Pass formatted time as a prop to display in the center
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  pomodoro,
  modeColor,
  secondsElapsed,
  formattedTime,
}) => {
  const radius = 180;
  const stroke = 20;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Calculate progress
  const progress =
    (secondsElapsed /
      (pomodoro.mode === "pomodoro"
        ? pomodoro.durationInSeconds
        : pomodoro.mode === "shortBreak"
        ? pomodoro.break.shortBreakDurationInSeconds
        : pomodoro.break.longBreakDurationInSeconds)) *
    circumference;

  return (
    <div className="relative flex flex-col items-center p-4">
      <svg height={radius * 2} width={radius * 2} className="relative">
        {/* Background Circle */}
        <circle
          stroke="rgba(229, 231, 235, 1)" // Light gray for background
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Foreground Circle for Timer Progress */}
        <circle
          stroke={modeColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - progress}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
        {/* Text in the Center for Formatted Time */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="48px"
          fontWeight="bold"
          fill="black"
        >
          {formattedTime}
        </text>
        {/* Indicator for Completed Pomodoros */}
        <text
          x="50%"
          y="30%"
          textAnchor="middle"
          dy="1.5em"
          fontSize="24px"
          fontWeight="bold"
          fill="gray"
        >
          {pomodoro.mode.toUpperCase()}
        </text>
        {/* Pomodoros Completed */}
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          fontSize="18px"
          fontWeight="bold"
          fill="green"
        >
          Pomodoros: {pomodoro.pomodorosCompleted}
        </text>
        {/* Breaks Taken */}
        <text
          x="50%"
          y="65%"
          textAnchor="middle"
          fontSize="18px"
          fontWeight="bold"
          fill="blue"
        >
          Breaks: {pomodoro.break.breakCompleted}
        </text>
      </svg>
    </div>
  );
};

export default CircularProgressBar;
