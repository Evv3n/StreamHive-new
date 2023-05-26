const mysql = require('mysql');
const fs = require('fs');

function create_con(){
  return mysql.createConnection({
    host:"127.0.0.1", 
    user:"root", 
    password:"Passord1Passord2", 
    database:"StreamHive", 
    port:3306
  }); 
}
var con = create_con();

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
 
