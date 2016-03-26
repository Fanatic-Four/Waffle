var users = [];

function result(success, message, data) {
	return {
		success: success,
		message: message,
		data: data,
		count: data.length
	};
}

function createUser(username, password, firstName, lastName, phone) {

  if (users[username]) {
    return result(false, "User already exists", null);
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

    return result(true, "User created!", user);
  }

}

exports.createUser = createUser;
