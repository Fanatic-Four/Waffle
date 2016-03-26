var mongoose = require ("mongoose");

var users = [];


function createUser(username, password, firstName, lastName, phone) {

  if (users[username]) {
    return null;
    console.log("User already exists");
  }
  else {
    var user = {
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      events: []
    };

    users[username] = user;
    users.push(user);
	// mongodb
	var userSchema = new mongoose.Schema({
		username : String,
		password : String,
		firstName: String,
		lastName: String,
		phone: String,
		events: [ {type : mongoose.Schema.ObjectId, ref : 'Event'} ]
	});

	var UserModel = mongoose.model('User', userSchema);
	var userdb = new UserModel ({
    	username: username,
		password: password,
		firstName: firstName,
		lastName: lastName,
		phone: phone,
		events: []
    });
	userdb.save(function (err) {
		if (err) console.log ('Error on save!')
		else console.log('Successfully saved the user')
	});
    return user;
  }
}

function getUsers() {
  return users;
}

function addEvent(username, mEvent, number) {
  if (user[username]) {
    users[username].events[mEvent.id] = {
      mEvent: mEvent,
      number: number
    };
  }
}

exports.createUser = createUser;
exports.getUsers = getUsers;
exports.addEvent = addEvent;
