import React, { useState } from "react";
import Timer from "./Timer";
import { Task, Subtask, useTasks } from "../hooks/TasksContext";
import { Tab } from "../page";
import { usePomodoro } from "../hooks/PomodoroContext";
import PomodorosRating from "../PomodorosRating";

interface PomodorosManagerProps {
  selectedTask: Task;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  selectedSubtask: Subtask | null;
  setSelectedSubtask: React.Dispatch<React.SetStateAction<Subtask | null>>;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const PomodorosManager: React.FC<PomodorosManagerProps> = ({
  selectedTask,
  setSelectedTask,
  selectedSubtask,
  setSelectedSubtask,
}) => {
  const { pomodoro, setPomodoro } = usePomodoro();
  const { updateTask, updateSubtask } = useTasks();
  const [mode, setMode] = useState<"pomodoro" | "shortBreak" | "longBreak">(
    "pomodoro"
  );
  const [pomodoroSecondsElapsed, setPomodoroSecondsElapsed] = useState(0);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);

  const handleCompletePomodoro = () => {
    setIsPomodoroRunning(false);
    if (selectedSubtask) {
      const updatedSubtask = {
        ...selectedSubtask,
        pomodorosCompleted: selectedSubtask.pomodorosCompleted + 1,
      };
      updateSubtask(updatedSubtask);
      setSelectedSubtask(updatedSubtask);
    } else if (selectedTask) {
      const updatedTask = {
        ...selectedTask,
        pomodorosCompleted: selectedTask.pomodorosCompleted + 1,
      };
      updateTask(updatedTask);
      setSelectedTask(updatedTask);
    } else {
      console.log("No selected task", { selectedTask, selectedSubtask });
    }
    const isLongBreak =
      pomodoro.pomodorosCompleted % pomodoro.break.longBreakInterval === 0;
    setMode(isLongBreak ? "longBreak" : "shortBreak");
    setPomodoro({
      ...pomodoro,
      pomodorosCompleted: pomodoro.pomodorosCompleted + 1,
    });
  };

  const handleStartPomodoro = () => {
    setIsPomodoroRunning(true);
  };
  const handleInterruptPomodoro = () => {
    setIsPomodoroRunning(false);
  };
  const handleCancelPomodoro = () => {
    if (
      window.confirm("Are you sure you want to cancel the current Pomodoro?")
    ) {
      setIsPomodoroRunning(false);
      setPomodoroSecondsElapsed(0);
    }
  };

  const task = selectedSubtask || selectedTask;

  return (
    <div className="flex flex-col items-center p-2">
      <div className="flex flex-col space-y-2">
        <h1 className="text-center text-2xl font-bold">
          <span className="block text-gray-500">I&apos;m focusing on</span>
          <span className="block">{task.title}</span>
        </h1>
        <PomodorosRating
          value={task.pomodorosRequired}
          completed={task.pomodorosCompleted}
          mode="Display"
          className="justify-center"
          onChange={() => {}}
        ></PomodorosRating>
      </div>
      <Timer
        pomodoro={pomodoro}
        task={task}
        handleCompletePomodoro={handleCompletePomodoro}
        handleStartPomodoro={handleStartPomodoro}
        handleInterruptPomodoro={handleInterruptPomodoro}
        handleCancelPomodoro={handleCancelPomodoro}
        pomodoroSecondsElapsed={pomodoroSecondsElapsed}
        setPomodoroSecondsElapsed={setPomodoroSecondsElapsed}
        isTimerRunning={isPomodoroRunning}
        mode={mode}
      />
    </div>
  );
};

export default PomodorosManager;
