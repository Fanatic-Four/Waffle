var express = require('express');
var app = express();
var http = require ('http');
var mongoose = require ("mongoose");
var handlebars = require('express-handlebars');

app.use(express.static(__dirname + '/public'));

var uristring = 'mongodb://heroku_xvxr827b:735klrc3ennhtqa8b1u2437fo2@ds025459.mlab.com:25459/heroku_xvxr827b';
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});

app.set('port', (process.env.PORT || 3000));

var userCol = require('./lib/users.js');
var eventCol = require('./lib/events.js');

//Handlebars
var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

// The body parser is used to parse the body of an HTTP request.
var bodyParser = require('body-parser');

// Body Parser:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/test', function(req, res) {
    userCol.createUser("myatnoe", "password", "MyatNoe", "Aint", "6176429478", []);
    res.render('index');
});

//Testing for dummy events:
var user = userCol.createUser("user", "password", "MyatNoe", "Aint", "7322771111");
var myat = userCol.createUser("myatnoe", "password", "MyatNoe", "Aint", "7322771111", []);

var event1 = eventCol.createEvent(user, "name1", "desc1");
var event2 = eventCol.createEvent(user, "name2", "desc2");
var event3 = eventCol.createEvent(user, "name3", "desc3");
var event4 = eventCol.createEvent(myat, "name4", "desc4");
var event5 = eventCol.createEvent(myat, "name5", "desc5");

eventCol.addUser(event1, user, 101);
eventCol.addUser(event1, user, 102);
eventCol.addUser(event1, user, 103);

eventCol.addUser(event4, user, 100);
userCol.addEvent(user.username, event4, 100);

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

    console.log("Signup page reached");

    var newUser = userCol.createUser(username, password, fName, lName, phone);
    if (newUser) {
        //Success!
        console.log("Success on signup");
        res.send("Success");
        //res.redirect('/main');
    }
    else {
        console.log("Failure to signup");
        res.send("Failure. User already exists");
        //res.redirect('/');
    }
});

app.get('/events', function(req, res) {

  var username = req.query.username;
  var currentUser = userCol.getUsers()[username];
  var attending = userCol.getUsers()[username].events;

  //console.log(attending);

  var currentEvents = eventCol.getEvents();
  var hosted = [];

  var other = [];

  for (var i = 0; i < currentEvents.length; i++) {
    if (currentEvents[i].creator.username === username) {
      hosted.push(currentEvents[i]);
    }
    else {
      var isAttending = false;

      for (var j = 0; j < attending.length; j++) {
        if(attending[j].mEvent.id === currentEvents[i].id || currentEvents[i].creator.username === username) {
          isAttending = true;
        }
      }

      if (!isAttending) {
          other.push(currentEvents[i]);
      }
    }
  }

  //console.log(currentEvents);

  //console.log(other);

  res.render('events', {
    hosted: hosted,
    attending: attending,
    other: other,
    currentUser: currentUser
  });
});

app.get('/android-events', function(req, res) {
  var username = req.query.username;
  var attending = userCol.getUsers()[username].events;

  //console.log(attending);

  var currentEvents = eventCol.getEvents();
  var hosted = [];

  var other = [];

  for (var i = 0; i < currentEvents.length; i++) {
    if (currentEvents[i].creator.username === username) {
      hosted.push(currentEvents[i]);
    }
    else {
      var isAttending = false;

      for (var j = 0; j < attending.length; j++) {
        if(attending[j].mEvent.id === currentEvents[i].id || currentEvents[i].creator.username === username) {
          isAttending = true;
        }
      }

      if (!isAttending) {
          other.push(currentEvents[i]);
      }
    }
  }

  var hostedResult = "";

  for (var i = 0; i < hosted.length; i++) {
  	hostedResult += "HOST,"
    hostedResult += hosted[i].creator.username + ",";
    hostedResult += hosted[i].name + ",";

    if (hosted[i].attendees.length > 0) {
      hostedResult += hosted[i].desc + ",";
      // hostedResult += "Attendees:";

      for (var j = 0; j < hosted[i].attendees.length; j++) {
          if (j < hosted[i].attendees.length - 1) {
              hostedResult += hosted[i].attendees[j].user.username + ",";
          }
          else {
              hostedResult += hosted[i].attendees[j].user.username;
          }
      }
    }
    else {
      hostedResult += hosted[i].desc + "";
    }

    hostedResult += "\n";
  }


  var attendingResult = "";

  for (var i = 0; i < attending.length; i++) {
    var mEvent = attending[i].mEvent;

    attendingResult += "ATTENDING,"
    attendingResult += mEvent.creator.username + ",";
    attendingResult += mEvent.name + ",";

    if (mEvent.attendees.length > 0) {
      attendingResult += mEvent.desc + ",";
      // attendingResult += "Attendees:";

      for (var j = 0; j < mEvent.attendees.length; j++) {
          if (j < mEvent.attendees.length - 1) {
              attendingResult += mEvent.attendees[j].user.username + ",";
          }
          else {
              attendingResult += mEvent.attendees[j].user.username;
          }
      }
    }
    else {
      attendingResult += mEvent.desc + "";
    }

    attendingResult += "\n";
  }

  var otherResult = "";

  for (var i = 0; i < other.length; i++) {
  	other += "OTHER,";
    otherResult += other[i].creator.username + ",";
    otherResult += other[i].name + ",";

    if (other[i].attendees.length > 0) {
      otherResult += other[i].desc + ",";
      // otherResult += "Attendees:";

      for (var j = 0; j < other[i].attendees.length; j++) {
          if (j < other[i].attendees.length - 1) {
              otherResult += other[i].attendees[j].user.username + ",";
          }
          else {
              otherResult += other[i].attendees[j].user.username;
          }
      }
    }
    else {
      otherResult += other[i].desc + "";
    }


    otherResult += "\n";
  }

  res.send("" + hostedResult + "\n" + attendingResult + "\n" + otherResult);
});


var twilio = require('./lib/twilio_msg.js');
app.post('/winner', function(req, res) {
  var eventID = req.query.id;
  //var winningNum = req.query.winner;

  ///var eventID = req.body.id;
  var winningNum = req.body.winner;

  var currentEvents = eventCol.getEvents();

  console.log(eventID);
  console.log(winningNum);

  var sent = false;

  for (var i = 0; i < currentEvents.length; i++) {

    if ("" + currentEvents[i].id === "" + eventID) {

      var attendees = currentEvents[i].attendees;

      for (var j = 0; j < attendees.length; j++) {

        if ("" + attendees[j].number === "" + winningNum) {
          res.send("Username: " + attendees[j].user.username + " | Phone Number: "  + attendees[j].user.phone);
          twilio.sendMessage(attendees[j].user.username, attendees[j].user.phone, currentEvents[i].name);
          sent = true;
        }
      }
    }
  }

  if (!sent) {
      res.send("No winner found");
  }

});

app.post('/add-event', function(req, res) {
  var creator = req.body.creator;
  var eventName = req.body.name;
  var desc = req.body.desc;

  creator = userCol.getUsers()[creator];

  eventCol.createEvent(creator, eventName, desc);

  res.redirect('/events?username=' + creator.username);

});

app.get('/announce', function(req, res) {
  var eventID = req.query.eventID;

  var currentEvents = eventCol.getEvents();

  var rendered = false;

  for (var i = 0; i < currentEvents.length; i++) {
    if ("" + currentEvents[i].id === "" + eventID) {
      res.render('announce', {
        eventName: currentEvents[i].name,
        eventID: eventID
      });
      rendered = true;
    }
  }

  if (!rendered) {
      res.redirect('/');
  }

});

app.post('/android-add-event', function(req, res) {
  var creator = req.body.creator;
  var eventName = req.body.name;
  var desc = req.body.desc;

  creator = userCol.getUsers()[creator];

  eventCol.createEvent(creator, eventName, desc);

  res.send("Successfully added event.");
});

app.post('/join', function(req, res) {
  var eventID = req.body.eventID;
  var username = req.body.username;
  var number = req.body.number;

  var currentEvents = eventCol.getEvents();

  var rendered = false;

  for (var i = 0; i < currentEvents.length; i++) {
    if ("" + currentEvents[i].id === "" + eventID) {

      var users = userCol.getUsers();
      var correctUser;

      for (var j = 0; j < users.length; j++) {
        if (users[j].username === username) {
          correctUser = users[j];
        }
      }

      eventCol.addUser(currentEvents[i], correctUser, number);
      userCol.addEvent(correctUser, currentEvents[i], number);
      res.redirect('/events?username=' + username);
      rendered = true;
    }
  }

  if (!rendered) {
      res.redirect('/');
  }

});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port:', app.get('port'));
});
