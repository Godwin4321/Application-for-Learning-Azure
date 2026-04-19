const taskModel = require("../models/taskModel");

exports.getTasks = (req, res) => {
  const tasks = taskModel.getAllTasks();
  res.json(tasks);
};

exports.createTask = (req, res) => {
  const { title } = req.body;

  // Validation
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Valid title is required" });
  }

  const newTask = taskModel.createTask(title.trim());
  res.status(201).json(newTask);
};

exports.deleteTask = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  const result = taskModel.deleteTask(id);

  if (!result) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json({ message: "Task deleted" });
};
