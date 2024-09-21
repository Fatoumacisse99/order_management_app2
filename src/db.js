const mysql = require("mysql2/promise");

const connPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "gestion_import_export",
  waitForConnections: true,
  connectionLimit: 2,
  connectTimeout: false,
  port: 3306,
});

connPool.getConnection().then(() => {
  console.log("CONNECTED");
});
module.exports = connPool;
