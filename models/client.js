const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const client = mysql.createPool({
    host: process.env.MYSQL_HOST,  
    user: process.env.MYSQL_USER,  
    password: process.env.MYSQL_PASSWORD,  
    database: process.env.MYSQL_DATABASE,
    ssl: {ca: fs.readFileSync('DigiCertGlobalRootCA.crt.pem')},
    port: 3306
});
  
module.exports = client;