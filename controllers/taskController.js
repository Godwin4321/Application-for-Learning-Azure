const taskModel = require("../models/taskModel");

// Added 'async' so we can use 'await' inside
exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskModel.getAllTasks(); // Wait for SQL to respond
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

exports.createTask = async (req, res) => {
  const { title } = req.body;

  // Validation
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Valid title is required" });
  }

  try {
    const newTask = await taskModel.createTask(title.trim());
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

exports.deleteTask = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    const result = await taskModel.deleteTask(id);

    if (!result) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};
