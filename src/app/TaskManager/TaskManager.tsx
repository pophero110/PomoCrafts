import React, { useState } from "react";
import TaskInput from "./TaskInput";
import TaskItem from "./TaskItem";
import SubtaskItem from "./SubtaskItem";
import { Task, Subtask, useTasks } from "../hooks/TasksContext";
import SubtaskInput from "./SubtaskInput";

interface TaskManagerProps {
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  selectedSubtask: Subtask | null;
  setSelectedSubtask: React.Dispatch<React.SetStateAction<Subtask | null>>;
  startTimer: () => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  selectedTask,
  setSelectedTask,
  selectedSubtask,
  setSelectedSubtask,
  startTimer,
}) => {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    findTask,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    findSubtask,
  } = useTasks();

  // Group related states together
  const [taskState, setTaskState] = useState({
    name: "",
    pomodoros: 1,
  });

  const [subtaskState, setSubtaskState] = useState({
    name: "",
    pomodoros: 1,
  });

  const handleCreateTask = () => {
    if (taskState.name.trim() === "") return;

    const lines = taskState.name.split("\n");
    const mainTask = lines[0]; // The first line is the main task

    let task: Task = {
      id: Date.now(),
      name: mainTask.trim(),
      pomodoros: taskState.pomodoros,
      completedPomodoros: 0,
      subtasks: [],
      note: "",
    };

    // Split the input into lines
    const subtasks = lines
      .slice(1)
      .filter(
        (line) =>
          line.trim().startsWith("-") ||
          line.trim().startsWith("*") ||
          line.trim().startsWith("•")
      )
      .map((line, index) => ({
        id: index + 1,
        taskId: task.id,
        name: line.trim().slice(1).trim(),
        pomodoros: 1,
        completedPomodoros: 0,
        note: "",
      }));

    task.subtasks = subtasks;

    createTask(task);
    setTaskState({ ...taskState, name: "" });
    setSelectedTask(task);

    if (task.subtasks.length !== 0) {
      task.pomodoros = 0;
      setSelectedSubtask(task.subtasks[0]);
    }
  };

  const handleUpdateTask = (oldTask: Task) => {
    const task = findTask(oldTask.id);
    if (task) {
      updateTask({ ...oldTask });
    }
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTask(taskId);
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
      setSelectedSubtask(null);
    }
  };

  const handleSelectTask = (taskId: number) => {
    const task = findTask(taskId);
    if (task) {
      setSelectedTask(task);
      if (task.subtasks.length !== 0) {
        setSelectedSubtask(task.subtasks[0]);
      } else {
        setSelectedSubtask(null);
      }
    }
  };

  const handleSelectSubtask = (subTaskId: number) => {
    const subtask = findSubtask(subTaskId);
    if (subtask) {
      setSelectedTask(findTask(subtask.taskId));
      setSelectedSubtask(subtask);
    }
  };

  const handleCreateSubtask = () => {
    if (subtaskState.name.trim() === "") return; // TODO: add error message
    if (selectedTask === null) return; // TODO: add error message

    createSubtask(selectedTask.id, {
      id: Date.now(),
      name: subtaskState.name,
      taskId: selectedTask.id,
      pomodoros: subtaskState.pomodoros,
      completedPomodoros: 0,
      note: "",
    });
    setSubtaskState({ ...subtaskState, name: "" });
  };

  const handleDeleteSubtask = (subTaskId: number) => {
    deleteSubtask(subTaskId);
    if (selectedSubtask?.id === subTaskId) {
      setSelectedSubtask(null);
    }
  };

  const handleUpdateSubtask = (oldSubTask: Subtask) => {
    const subtask = findSubtask(oldSubTask?.id);
    if (subtask) {
      updateSubtask({ ...oldSubTask });
    }
  };

  return (
    <div>
      <TaskInput
        taskState={taskState}
        setTaskState={setTaskState}
        addTask={handleCreateTask}
      />
      <ul className="space-y-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            selectedTask={selectedTask}
            handleUpdateTask={handleUpdateTask}
            handleSelectTask={handleSelectTask}
            handleDeleteTask={handleDeleteTask}
            startTimer={startTimer}
          >
            {selectedTask?.id === task.id && (
              <SubtaskInput
                subtaskState={subtaskState}
                setSubtaskState={setSubtaskState}
                handleCreateSubtask={handleCreateSubtask}
              />
            )}

            <ul className="list-disc space-y-2">
              {task.subtasks.map((subtask) => (
                <SubtaskItem
                  key={subtask.id}
                  subtask={subtask}
                  selectedSubtask={selectedSubtask}
                  handleUpdateSubtask={handleUpdateSubtask}
                  handleSelectSubtask={handleSelectSubtask}
                  handleDeleteSubtask={handleDeleteSubtask}
                  startTimer={startTimer}
                />
              ))}
            </ul>
          </TaskItem>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
