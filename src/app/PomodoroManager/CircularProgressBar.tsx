import React from "react";

interface CircularProgressBarProps {
  secondsElapsed: number;
  duration: number;
  formattedTime: string; // Pass formatted time as a prop to display in the center
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  secondsElapsed,
  duration,
  formattedTime,
}) => {
  const radius = 180;
  const stroke = 20;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = (secondsElapsed / duration) * circumference;

  return (
    // TODO: if current task is completed, change circle stroke color to gray
    <div className="relative flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2} className="relative">
        {/* Background Circle */}
        <circle
          stroke="rgba(239,68,68,1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Foreground Circle for Timer Progress */}
        <circle
          stroke="rgba(34, 197, 94, 1)"
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
          y="50%" /* Adjust the Y position slightly up to make room for the caption */
          textAnchor="middle"
          dy=".3em"
          fontSize="48px"
          fontWeight="bold"
          fill="black"
        >
          {formattedTime}
        </text>
        {/* Render PomodorosRating above formattedTime */}
        {/* <foreignObject x="0" y="65%" width="100%" height="30">
          <div className="flex justify-center items-center">{children}</div>
        </foreignObject> */}
      </svg>
    </div>
  );
};

export default CircularProgressBar;
