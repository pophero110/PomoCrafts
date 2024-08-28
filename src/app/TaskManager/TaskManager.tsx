import React, { useState } from "react";
import TaskInput from "./TaskInput";
import TaskItem from "./TaskItem";
import SubtaskInput from "./SubtaskInput";
import SubtaskItem from "./SubtaskItem";
import { Task, Subtask, useTasks } from "../hooks/TasksContext";

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
  const [taskInput, setTaskInput] = useState<string>("");
  const [taskNameInput, setTaskNameInput] = useState<string>("");
  const [isEditingTask, setIsEditingTask] = useState<number>(0);
  const [subtaskInput, setSubtaskInput] = useState<string>("");
  const [subtaskNameInput, setSubtaskNameInput] = useState<string>("");
  const [isEditingSubtask, setIsEditingSubtask] = useState<number>(0);
  const [pomodoros, setPomodoros] = useState<number>(1);
  const [isTaskInputExpanded, setIsTaskInputExpanded] =
    useState<boolean>(false);

  const handleCreateTask = () => {
    if (taskInput.trim() === "") return;

    const lines = taskInput.split("\n");
    const mainTask = lines[0]; // The first line is the main task

    let task: Task = {
      id: Date.now(),
      name: mainTask.trim(),
      pomodoros,
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
        id: index + 1, // Subtask IDs can be index-based or generated differently
        taskId: task.id, // Associate each subtask with the main task's ID
        name: line.trim().slice(1).trim(), // Remove the bullet point and any leading/trailing whitespace
        pomodoros: 1,
        completedPomodoros: 0,
        note: "",
      }));

    task.subtasks = subtasks;

    createTask(task);
    setTaskInput("");
    setSelectedTask(task);
    if (task.subtasks.length != 0) {
      task.pomodoros = 0;
      setSelectedSubtask(task.subtasks[0]);
    }
  };

  const handleUpdateTask = (name: string) => {
    const task = findTask(isEditingTask);
    if (task) {
      updateTask({ ...task, name });
    }
    setIsEditingTask(0); // move to somewhere else
  };

  const handleDeleteTask = (event: React.MouseEvent, taskId: number) => {
    event.stopPropagation();

    deleteTask(taskId);
    const isCurrentTaskSelected = selectedTask?.id === taskId;
    // Update selected task and subtask if the deleted task was selected
    if (isCurrentTaskSelected) {
      setSelectedTask(null);
      setSelectedSubtask(null);
    }
  };

  const handleSelectTask = (taskId: number) => {
    const task = findTask(taskId);
    if (task) {
      if (task.subtasks.length != 0) {
        setSelectedSubtask(task.subtasks[0]);
      } else {
        setSelectedSubtask(null);
      }
    }
  };

  const handleUpdateTaskPomodoros = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    taskId: number,
    pomodoros: number
  ) => {
    event?.stopPropagation();
    const task = findTask(taskId);
    if (task) {
      const isCurrentTaskSelected = selectedTask?.id === taskId;
      if (isCurrentTaskSelected) {
        setSelectedTask(task);
      }
      updateTask({ ...task, pomodoros });
    }
  };

  const handleSubtaskPomodorosChange = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    subtaskId: number,
    pomodoros: number
  ) => {
    event.stopPropagation();

    const subtask = findSubtask(subtaskId);
    if (subtask != null) {
      updateSubtask({ ...subtask, pomodoros });
      const isCurrentSubtaskSelected = selectedSubtask?.id === subtaskId;
      if (isCurrentSubtaskSelected) {
        setSelectedSubtask(subtask);
      }
    }
  };

  const handleCreateSubtask = (taskId: number) => {
    if (subtaskInput.trim() === "") return;

    createSubtask(taskId, {
      id: Date.now(),
      name: subtaskInput,
      taskId,
      pomodoros: 1,
      completedPomodoros: 0,
      note: "",
    });
    setSubtaskInput(""); // TODO: move it somewhere else
  };

  const handleDeleteSubtask = (event: React.MouseEvent, subTaskId: number) => {
    event?.stopPropagation();
    deleteSubtask(subTaskId);
    const isCurrentSubtaskSelected = selectedSubtask?.id === subTaskId;
    if (isCurrentSubtaskSelected) {
      setSelectedSubtask(null);
    }
  };

  const handleSelectSubtask = (subTaskId: number) => {
    const subtask = findSubtask(subTaskId);
    if (subtask) {
      const task = findTask(subtask?.id);
      setSelectedTask(task);
      setSelectedSubtask(selectedSubtask);
    }
  };

  const handleSubtaskEditing = (name: string) => {
    const subtask = findSubtask(isEditingSubtask);
    if (subtask) {
      updateSubtask({ ...subtask, name });
      setIsEditingSubtask(0); // Reset the editing state // TODO: move it somewhere else
    }
  };

  const handleEditTaskKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleUpdateTask(taskNameInput);
    }
  };

  const handleEditSubtaskKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubtaskEditing(subtaskNameInput);
    }
  };

  return (
    <div>
      <TaskInput
        taskInput={taskInput}
        pomodoros={pomodoros}
        handlePomodorosInput={(e) => {
          e.stopPropagation();
          setPomodoros(pomodoros);
        }}
        handleTaskInputChange={(e) => setTaskInput(e.target.value)}
        addTask={handleCreateTask}
        isTaskInputExpanded={isTaskInputExpanded}
        setIsTaskInputExpanded={setIsTaskInputExpanded}
      />
      <ul className="space-y-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            selectedTask={selectedTask}
            isEditingTask={isEditingTask}
            taskNameInput={taskNameInput}
            setTaskNameInput={setTaskNameInput}
            handleUpdateTaskPomodoros={handleUpdateTaskPomodoros}
            handleUpdateTask={handleUpdateTask}
            handleSelectTask={handleSelectTask}
            handleDeleteTask={handleDeleteTask}
            startTimer={startTimer}
            handleEditTaskKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleUpdateTask(taskNameInput);
              }
            }}
          >
            <div>
              {selectedTask?.id === task.id && (
                <SubtaskInput
                  subtaskInput={subtaskInput}
                  handleSubtaskInputChange={(e) =>
                    setSubtaskInput(e.target.value)
                  }
                  addSubtask={() => handleCreateSubtask(task.id)}
                  taskId={task.id}
                  handleAddSubtaskKeyDown={(event) => {}}
                />
              )}
              <ul className="list-disc space-y-2">
                {task.subtasks.map((subtask) => (
                  <SubtaskItem
                    key={subtask.id}
                    subtask={subtask}
                    selectedSubtask={selectedSubtask}
                    isEditingSubtask={isEditingSubtask}
                    subtaskNameInput={subtaskNameInput}
                    setSubtaskNameInput={setSubtaskNameInput}
                    handleSubtaskPomodorosChange={handleSubtaskPomodorosChange}
                    handleSubtaskEditing={handleSubtaskEditing}
                    handleSelectSubtask={handleSelectSubtask}
                    handleDeleteSubtask={handleDeleteSubtask}
                    startTimer={startTimer}
                    handleEditSubtaskKeyDown={handleEditSubtaskKeyDown}
                  />
                ))}
              </ul>
            </div>
          </TaskItem>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
