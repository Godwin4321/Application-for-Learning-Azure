require("dotenv").config(); // Loads your .env variables
const sql = require("mssql");

// Configuration using Environment Variables for security
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

// Create a connection pool to manage multiple requests efficiently
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to Azure SQL Database!");
    return pool;
  })
  .catch((err) => {
    console.error(
      "Database Connection Failed! Bad config or network issue: ",
      err,
    );
    process.exit(1); // Stop the app if it can't reach the DB
  });

module.exports = {
  // READ: Get all tasks from the SQL Table
  getAllTasks: async () => {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT id, title, created_at FROM Tasks");
    return result.recordset;
  },

  // CREATE: Insert a new task and return the created record
  createTask: async (title) => {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("title", sql.NVarChar, title) // Prevents SQL Injection
      .query("INSERT INTO Tasks (title) OUTPUT INSERTED.* VALUES (@title)");
    return result.recordset[0];
  },

  // DELETE: Remove a task by its ID
  deleteTask: async (id) => {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", sql.Int, id) // Prevents SQL Injection
      .query("DELETE FROM Tasks WHERE id = @id");

    // Returns true if a row was actually deleted, else null
    return result.rowsAffected[0] > 0 ? true : null;
  },
};
