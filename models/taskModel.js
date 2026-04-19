let tasks = [];

const getAllTasks = () => {
  return tasks;
};

const createTask = (title) => {
  const newTask = {
    id: Date.now(),
    title,
  };

  tasks.push(newTask);
  return newTask;
};

const deleteTask = (id) => {
  const initialLength = tasks.length;

  tasks = tasks.filter((task) => task.id !== id);

  if (tasks.length === initialLength) {
    return null; // not found
  }

  return true;
};

module.exports = {
  getAllTasks,
  createTask,
  deleteTask,
};
