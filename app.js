var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

var userCol = require('./lib/users.js');
var eventCol = require('./lib/events.js');

// The body parser is used to parse the body of an HTTP request.
var bodyParser = require('body-parser');

// Body Parser:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.post('/login', function(req, res) {

  console.log(req);

  var username = req.body.username;
  var password = req.body.password;

  console.log(username);
  console.log(password);

  var users = userCol.getUsers();

  if (users[username] && users[username].password === password) {
    console.log("Success on login");
    res.send('Success');
    res.redirect('/main');
  }
  else {
    console.log("Failure to login");
    res.send('Failure');
  }

});

app.post('/signup', function(req, res) {
  var username = req.body.name;
  var password = req.body.pass;
  var fName = req.body.fName;
  var lName = req.body.lName;
  var phone = req.body.phone;

  var newUser = userCol.createUser(username, password, fName, lName, phone);
  if (newUser) {
    //Success!
    console.log("Success on signup");
    res.send("Success");
    res.redirect('/main');
  }
  else {
    console.log("Failure to signup");
    res.send("Failure. User already exists");
    res.redirect('/');
  }



});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port:', app.get('port'));
});
