import React, { useState } from "react";
import { usePomodoro } from "./hooks/PomodoroContext";

const PomodoroSettings: React.FC = () => {
  const { pomodoro, setPomodoro } = usePomodoro();

  const [durationInMinutes, setDurationInMinutes] = useState(
    pomodoro.durationInSeconds / 60
  );
  const [shortBreakDurationInMinutes, setShortBreakDurationInMinutes] =
    useState(pomodoro.break.shortBreakDurationInSeconds / 60);
  const [longBreakDurationInMinutes, setLongBreakDurationInMinutes] = useState(
    pomodoro.break.longBreakDurationInSeconds / 60
  );
  const [longBreakInterval, setLongBreakInterval] = useState(
    pomodoro.break.longBreakInterval
  );
  const [isSaving, setIsSaving] = useState(false); // State to handle animation

  const handleSave = () => {
    setIsSaving(true); // Trigger animation
    setPomodoro((prev) => {
      return {
        ...prev,
        durationInSeconds: durationInMinutes * 60,
        break: {
          ...prev.break,
          shortBreakDurationInSeconds: shortBreakDurationInMinutes * 60,
          longBreakDurationInSeconds: longBreakDurationInMinutes * 60,
          longBreakInterval,
        },
      };
    });

    // Reset the animation after a brief delay
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Customize Your Pomodoro
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pomodoro Duration (minutes):
          </label>
          <input
            type="number"
            value={durationInMinutes}
            max={75}
            onChange={(e) => setDurationInMinutes(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Break Duration (minutes):
          </label>
          <input
            type="number"
            value={shortBreakDurationInMinutes}
            onChange={(e) =>
              setShortBreakDurationInMinutes(Number(e.target.value))
            }
            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Long Break Duration (minutes):
          </label>
          <input
            type="number"
            value={longBreakDurationInMinutes}
            onChange={(e) =>
              setLongBreakDurationInMinutes(Number(e.target.value))
            }
            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Long Break Interval (Pomodoros):
          </label>
          <input
            type="number"
            value={longBreakInterval}
            onChange={(e) => setLongBreakInterval(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`mt-6 w-full text-white py-2 rounded-md transition-all duration-300 ${
          isSaving ? "bg-green-500" : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        {isSaving ? "Settings Saved!" : "Save Settings"}
      </button>
    </div>
  );
};

export default PomodoroSettings;
