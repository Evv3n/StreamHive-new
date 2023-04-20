const mysql = require('mysql');
const fs = require('fs');

var con=mysql.createConnection({
    host:"eivinddatabase.mysql.database.azure.com", 
    user:"azureuser", 
    password:"@31v1nd@;elsker@!databaser", 
    database:"StreamHive", 
    port:3306, 
    ssl:{ca:fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log('StreamHive database connected');
  });
  
  // Close the connection when the application is terminated
  process.on('SIGINT', function() {
    con.end(function() {
      console.log('StreamHive database closed');
      process.exit();
    });
  });
  
  // Export the connection object for reuse in other modules
  module.exports = con;
