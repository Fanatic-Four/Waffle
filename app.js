var express = require('express');
var app = express();
var http = require ('http');
var mongoose = require ("mongoose");

var uristring = 'mongodb://waffle-user:waffle-user@ds025459.mlab.com:25459/heroku_xvxr827b';
mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

var userCol = require('./lib/users.js');
var eventCol = require('./lib/events.js');

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  response.render('pages/index');
});

app.get('/test', function(req, res) {
    userCol.createUser("myatnoe", "password", "MyatNoe", "Aint", "6176429478", [])
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.pass;

  var users = userCol.getUsers();

  if (users[username] && users[username].password === password) {
    res.send('Success');
    res.redirect('/main');
  }
  else {
    res.send('Failure');
  }

});

app.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.pass;
  var fName = req.body.fName;
  var lName = req.body.lName;
  var phone = req.body.phone;



});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port:', app.get('port'));
});
