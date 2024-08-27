import React, { useState } from "react";
import { Task } from "./types";

interface RecordManagerProps {
  tasks: Task[];
  handleTaskNoteUpdate: (taskId: number, note: string) => void;
}

const RecordManager: React.FC<RecordManagerProps> = ({
  tasks,
  handleTaskNoteUpdate,
}) => {
  // Filter to get completed tasks
  const completedTasks = tasks.filter((task) => {
    const areAllSubtasksCompleted = task.subtasks.every(
      (subtask) => subtask.pomodoros === subtask.completedPomodoros
    );
    return (
      task.pomodoros === task.completedPomodoros && areAllSubtasksCompleted
    );
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>
      {completedTasks.length === 0 ? (
        <p className="text-gray-500">No completed tasks.</p>
      ) : (
        <ul className="space-y-4">
          {completedTasks.map((task) => (
            <li
              key={task.id}
              className="p-4 bg-white rounded shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold">{task.name}</span>
                {task.subtasks.length == 0 && (
                  <span className="text-sm text-gray-600">
                    Pomodoros: {task.completedPomodoros}/{task.pomodoros}
                  </span>
                )}
              </div>
              <textarea
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                rows={3}
                placeholder="Add a note..."
                value={task.note}
                onChange={(e) => handleTaskNoteUpdate(task.id, e.target.value)}
              ></textarea>

              {/* Subtasks Section */}
              {task.subtasks.map((subtask) => (
                <div key={subtask.id}>
                  <div className="flex justify-between items-center">
                    <span className="text-md text-gray-800">
                      {subtask.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      Pomodoros: {subtask.completedPomodoros}/
                      {subtask.pomodoros}
                    </span>
                  </div>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 mt-2"
                    rows={2}
                    placeholder="Add a note for subtask..."
                  ></textarea>
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecordManager;
