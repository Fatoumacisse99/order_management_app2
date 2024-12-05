const mysql = require("mysql2/promise");

const connPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Fama20364174",
  database: "gestion_import_export",
  waitForConnections: true,
  connectionLimit: 2,
  connectTimeout: false,
  port: 3308,
});

connPool.getConnection().then(() => {
  // console.log("CONNECTED");
});
module.exports = connPool;
