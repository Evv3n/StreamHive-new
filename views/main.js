const express = require('express');
const session = require('express-session');
const fs = require('fs'); 
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

//includes database connection
function create_con(){
  return mysql.createConnection({
    host:"eivinddatabase.mysql.database.azure.com", 
    user:"azureuser", 
    password:"@31v1nd@;elsker@!databaser", 
    database:"StreamHive", 
    port:3306, 
    ssl:{ca:fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}
  }); 
}
con = create_con();
con.connect(function(err) {
  if (err) throw err;
  console.log('StreamHive Database is connected');
});

var con = create_con();
const crypto = require('crypto');
//generates random string for session cookie
const nohackers = crypto.randomBytes(16).toString('hex');
console.log('Crypto string: ' + nohackers);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: nohackers,
  resave: false,
  saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.get('/index', (req, res) => {
  // Render the register page
  res.render('index');
});
app.get('/register', (req, res) => {
  // Render the register page
  res.render('register');
});
app.get('/login', (req, res) => {
  // Render the login page
  res.render('login');
});
//register
app.post('/register', (req, res) => {
  con = create_con()
  const username = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;

  // Check if email is already registered
  const emailQuery = 'SELECT * FROM users WHERE email = ?';
  con.query(emailQuery, [email], (err, results) => {
    if (err) {
      throw err;
    }
    if (results.length > 0) {
      res.send('<p class="error">The email address is already registered!</p>');
    } else {
      // Validate password
      if (password.length < 6) {
        res.send('<p class="error">Password must have at least 6 characters.</p>');
        return;
      }

      // Validate confirm password
      if (confirm_password !== password) {
        res.send('<p class="error">Password did not match.</p>');
        return;
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          throw err;
        }
        const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        con.query(insertQuery, [username, email, hash], (err, results) => {
          if (err) {
            throw err;
          }
          res.send('<p class="success">Your registration was successful!</p>');
        });
      });
    }
  });
});
//login
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let error = '';

  // validate if email is empty
  if (!email) {
    error = '<p class="error">Please enter email.</p>';
  }

  // validate if password is empty
  if (!password) {
    error += '<p class="error">Please enter your password.</p>';
  }

  if (!error) {
    const emailQuery = 'SELECT * FROM users WHERE email = ?';
    con.query(emailQuery, [email], (err, results) => {
      if (err) {
        throw err;
      }

      if (results.length > 0) {
        bcrypt.compare(password, results[0].password, (err, result) => {
          if (err) {
            throw err;
          }

          if (result === true) {
            req.session.loggedIn = true;
            req.session.userId = results[0].id;
            req.session.user = results[0];
            res.redirect('/index');
          } else {
            error = '<p class="error">The password is not valid.</p>';
            res.send(error);
          }
        });
      } else {
        error = '<p class="error">No user exists with that email address.</p>';
        res.send(error);
      }
    });
  } else {
    res.send(error);
  }
});


app.get('/', function (req, res) {
  // Check if the user is logged in
  if (req.session && req.session.loggedIn) {
    // User is logged in, render the home page
    con.connect(function(err) {
      con.query("SELECT user_id FROM users", function (err, result, fields) {
        if (err) throw err;  
        res.render('index', {
          data: result
        });
      }); 
    });
  } else {
    // User is not logged in, redirect to the login page
    res.redirect('/login');
  }
});

var server = app.listen(8081, function () {
  var host = server.address().address.replace('::', "Port:")
  var port = server.address().port
  console.log("Localhost", host, port)
});