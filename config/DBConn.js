// Import mysql2/promise for async/await functionality with MySQL
const mysql = require("mysql2/promise");

// Creation of the async function to connect to the database
const DBConn = async () => {
  try {
    // Set up the connection pool with environment variables
    const pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      waitForConnections: process.env.DB_WAITFORCONNECTIONS === 'true',
      connectionLimit: parseInt(process.env.DB_CONNECTIONLIMIT, 10),
      queueLimit: parseInt(process.env.DB_QUEUELIMIT, 10)
    });

    // Create database if it does not exist
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\``);
    console.log(`Database '${process.env.DB_DATABASE}' created or already exists.`);

    // Switch to the created/existing database
    await pool.query(`USE \`${process.env.DB_DATABASE}\``);
    console.log(`Switched to database: '${process.env.DB_DATABASE}'`);

    // Create the specified table if it doesn't exist
    await pool.query(
      `CREATE TABLE IF NOT EXISTS \`${process.env.DB_TABLENAME}\` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    );
    console.log(`Table '${process.env.DB_TABLENAME}' created or already exists.`);

    // Return the pool to use in controller functions
    return pool;

  } catch (error) {
    // Specific error handling
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("Access denied: Check your database credentials in the .env file.");
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error("Database does not exist and could not be created.");
    } else {
      console.error("Error during database connection:", error);
    }
  }
};

// Exporting the function for use in other modules
module.exports = DBConn;
