require("dotenv").config();
const sql = require("mssql");

// Configuration using Environment Variables
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Vital for Azure SQL
    trustServerCertificate: false,
  },
};

// Create a connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to Azure SQL Database!");
    return pool;
  })
  .catch((err) => {
    console.error("Database Connection Failed: ", err);
    process.exit(1);
  });

module.exports = {
  // READ: Get all tasks
  getAllTasks: async () => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .query("SELECT id, title, created_at FROM Tasks");
      // .recordset contains the array of rows. We return an empty array if null.
      return result.recordset || [];
    } catch (err) {
      console.error("SQL Read Error: ", err);
      return [];
    }
  },

  // CREATE: Insert a new task
  createTask: async (title) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("title", sql.NVarChar, title)
        .query("INSERT INTO Tasks (title) OUTPUT INSERTED.* VALUES (@title)");
      return result.recordset[0];
    } catch (err) {
      console.error("SQL Create Error: ", err);
      throw err;
    }
  },

  // DELETE: Remove a task by ID
  deleteTask: async (id) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query("DELETE FROM Tasks WHERE id = @id");
      return result.rowsAffected[0] > 0;
    } catch (err) {
      console.error("SQL Delete Error: ", err);
      return false;
    }
  },
};
