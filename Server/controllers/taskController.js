const TaskModel = require("../models/taskModel");

const getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.getAll();
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await TaskModel.getById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch task" });
  }
};

const createTask = async (req, res) => {
  const { title, completed } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "A valid title is required" });
  }

  try {
    const task = await TaskModel.create({ title, completed });
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create task" });
  }
};

const updateTask = async (req, res) => {
  const { title, completed } = req.body;

  if (typeof title === "undefined" && typeof completed === "undefined") {
    return res
      .status(400)
      .json({ message: "Provide at least one field to update" });
  }

  try {
    const updatedTask = await TaskModel.update(req.params.id, { title, completed });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deleted = await TaskModel.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete task" });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
