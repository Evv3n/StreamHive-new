const express = require('express');
const session = require('express-session');
const fs = require('fs'); 
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

//includes database connection
function create_con(){
  return mysql.createConnection({
    host:"localhost", 
    user:"root", 
    password:"password", 
    database:"streamhive", 
    port:3306,
    insecureAuth: true
  }); 
}

var con

//con = create_con();
//con.connect(function(err) {
  //if (err) throw err;
  //console.log('StreamHive Database is connected');
//});


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
  res.redirect('/');
});
app.get('/register', (req, res) => {
  // Render the register page
  res.render('register');
});
app.get('/stream', (req, res) => {
    // Check if the user is logged in
      if (req.session && req.session.loggedIn) {
        // Retrieve the username from the session
        var username = req.session.user.username;
    
        // Check if the user has uploaded a profile picture
        var profilePictureUrl = req.session.user.profilePictureUrl ? req.session.user.profilePictureUrl : '/images/defaultpfp.png';
    
        // User is logged in, render the home page
        con.connect(function(err) {
          con.query("SELECT user_id, username FROM users", function (err, result, fields) {
            if (err) throw err;  
            res.render('stream', { 
              data: result,
              username: username, // Pass the username to the template
              profilePictureUrl: profilePictureUrl // Pass the profile picture URL to the template
            });
          }); 
        });
      } else {
        // User is not logged in, redirect to the login page
        res.redirect('/login');
      }
});
app.get('/login', (req, res) => {
  // Render the login page
  res.render('login');
});
app.get('/browse', (req, res) => {
  // Render the browse page
  res.render('browse');
});
app.get('/channel', (req, res) => {
    // Check if the user is logged in
    if (req.session && req.session.loggedIn) {
      // Retrieve the username from the session
      var username = req.session.user.username;
  
      // Check if the user has uploaded a profile picture
      var profilePictureUrl = req.session.user.profilePictureUrl ? req.session.user.profilePictureUrl : '/images/defaultpfp.png';
  
      // User is logged in, render the home page
      con.connect(function(err) {
        con.query("SELECT user_id, username FROM users", function (err, result, fields) {
          if (err) throw err;  
          res.render('channel', { 
            data: result,
            username: username, // Pass the username to the template
            profilePictureUrl: profilePictureUrl // Pass the profile picture URL to the template
          });
        }); 
      });
    } else {
      // User is not logged in, redirect to the login page
      res.redirect('/login');
    }
});

app.get('/toggle', (req, res) => {
  const currentTheme = req.query.theme;
  const themeLink = `<link id="theme-link" rel="stylesheet" type="text/css" href="${currentTheme === 'dark' ? 'dark-style.css' : 'light-style.css'}">`;
  res.send(themeLink);
})
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
          res.redirect('/login'); 
        });
      });
    }
  });
});
app.get('/logout', (req, res) => {
  // Clear the session and redirect to the login page
  req.session.destroy((err) => {
    if (err) {
      console.log('Error logging out:', err);
    }
    res.redirect('/login');
  });
});

//login
app.post('/login', (req, res) => {
  con = create_con()
  const username = req.body.username;
  const password = req.body.password;
  let error = '';

  // validate if username is empty
  if (!username) {
    error = '<p class="error">Please enter username.</p>';
  }

  // validate if password is empty
  if (!password) {
    error += '<p class="error">Please enter your password.</p>';
  }

  if (!error) {
    const usernameQuery = 'SELECT * FROM users WHERE username = ?';
    con.query(usernameQuery, [username], (err, results) => {
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
    // Retrieve the username from the session
    var username = req.session.user.username;

    // Check if the user has uploaded a profile picture
    var profilePictureUrl = req.session.user.profilePictureUrl ? req.session.user.profilePictureUrl : '/images/defaultpfp.png';

    // User is logged in, render the home page
    con.connect(function(err) {
      con.query("SELECT user_id, username FROM users", function (err, result, fields) {
        if (err) throw err;  
        res.render('index', { 
          data: result,
          username: username, // Pass the username to the template
          profilePictureUrl: profilePictureUrl // Pass the profile picture URL to the template
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