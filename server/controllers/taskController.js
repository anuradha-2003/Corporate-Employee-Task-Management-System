
const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline } = req.body || {};

    if (!title || !description || !deadline) {
      return res.status(400).json({
        message: "Title, description and deadline are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      deadline,
      assignedTo: req.user.id,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Task creation failed",
      error: error.message,
    });
  }
};

// Get All Tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.id,
    });

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// Get Single Task
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      deadline,
    } = req.body || {};

    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (deadline !== undefined) task.deadline = deadline;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Task update failed",
      error: error.message,
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      assignedTo: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Task deletion failed",
      error: error.message,
    });
  }
};

// Get Dashboard Statistics
const getTaskStats = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.id,
    });

    const totalTasks = tasks.length;

    const pendingTasks = tasks.filter(
      (task) => task.status === "To Do"
    ).length;

    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const overdueTasks = tasks.filter(
      (task) =>
        task.status !== "Completed" &&
        new Date(task.deadline) < new Date()
    ).length;

    res.status(200).json({
      message: "Task statistics fetched successfully",
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch task statistics",
      error: error.message,
    });
  }
};

// Export All Functions
module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
};
