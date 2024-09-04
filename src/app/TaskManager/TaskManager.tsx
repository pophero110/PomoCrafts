import React, { useState } from "react";
import TaskInput from "./TaskInput";
import TaskItem from "./TaskItem";
import SubtaskItem from "./SubtaskItem";
import { Task, Subtask, useTasks } from "../hooks/TasksContext";
import SubtaskInput from "./SubtaskInput";
import { Priority } from "../PriorityRating";

interface TaskManagerProps {
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  selectedSubtask: Subtask | null;
  setSelectedSubtask: React.Dispatch<React.SetStateAction<Subtask | null>>;
  startTimer: () => void;
}

export interface TaskState {
  name: string;
  pomodoros: number;
  priority: Priority;
}

export interface SubtaskState {
  name: string;
  pomodoros: number;
  priority: Priority;
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
  const [taskState, setTaskState] = useState<TaskState>({
    name: "",
    pomodoros: 1,
    priority: "low",
  });

  const [subtaskState, setSubtaskState] = useState<SubtaskState>({
    name: "",
    pomodoros: 1,
    priority: "low",
  });

  const handleCreateTask = () => {
    if (taskState.name.trim() === "") return;

    const lines = taskState.name.split("\n");
    const mainTask = lines[0]; // The first line is the main task

    let task: Task = {
      id: Date.now(),
      title: mainTask.trim(),
      pomodorosRequired: taskState.pomodoros,
      priority: taskState.priority,
      pomodorosCompleted: 0,
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
      .map(
        (line, index): Subtask => ({
          id: index + 1,
          taskId: task.id,
          title: line.trim().slice(1).trim(),
          pomodorosRequired: 1,
          priority: "low",
          pomodorosCompleted: 0,
          note: "",
        })
      );

    task.subtasks = subtasks;

    createTask(task);
    setSelectedTask(task);
    if (task.subtasks.length !== 0) {
      task.pomodorosRequired = 0;
      setSelectedSubtask(task.subtasks[0]);
    } else {
      setSelectedSubtask(null);
    }
  };

  const handleUpdateTask = (task: Task) => {
    const oldTask = findTask(task.id);
    if (oldTask) {
      updateTask({ ...task });
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

    const subtask: Subtask = {
      id: Date.now(),
      title: subtaskState.name,
      taskId: selectedTask.id,
      pomodorosRequired: subtaskState.pomodoros,
      priority: subtaskState.priority,
      pomodorosCompleted: 0,
      note: "",
    };

    createSubtask(subtask);
    setSelectedSubtask(subtask);
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
            <ul className="list-disc space-y-2">
              {task.subtasks.map((subtask: Subtask) => (
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
              <SubtaskInput
                subtaskState={subtaskState}
                setSubtaskState={setSubtaskState}
                handleCreateSubtask={handleCreateSubtask}
              />
            </ul>
          </TaskItem>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
