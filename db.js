// db.js
require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2/promise'); // Import mysql2 with promise support

// Create an async function to establish a connection pool
const createDBConnection = async () => {
  try {
    // Set up the connection pool
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      waitForConnections: process.env.DB_WAITFORCONNECTIONS === 'true',
      connectionLimit: parseInt(process.env.DB_CONNECTIONLIMIT, 10),
      queueLimit: parseInt(process.env.DB_QUEUELIMIT, 10)
    });

    console.log("Connected to the MySQL database");

    // Return the pool to use for queries
    return pool;

  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

// Test connection when running `node db.js` directly
(async () => {
  const db = await createDBConnection();
  try {
    // Example query to test the connection
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    console.log("Test query result:", rows[0].solution); // Should log "2"
  } catch (err) {
    console.error("Database query error:", err);
  } finally {
    db.end(); // Close the connection pool after test
  }
})();

module.exports = createDBConnection;
