var express = require('express');
var app = express();

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
