// Someone sends {winning number, eventid, userid, message}
// Find event. Get all users attending that event
// Match winning number to each user's numbers
// Redirect to an XML page to send SMS to winner


function sendMessage(username, phonenum, eventName, desc) {
	console.log("twilio");
	// Twilio Credentials account
	var accountSid = 'AC08e7f42f27e2e24281d9edb1dabc8f21';
	var authToken = '3d8687d87e14f4357b9731ee79eeb2a0';
	var client = require('twilio')(accountSid, authToken);

	var message = 'Congratulations, ' + username + '! You won the raffle at ' + eventName + '. To claim your prize, event details are here: ' + desc;

	client.messages.create({
	    messagingServiceSid: 'MG4a08ca1c616cf1ebddbf6520968ca69c',
	    from: "+16172022125",
	    to: phonenum,
	    body: message
	}, function(err, message) {
		console.log(err);
	    console.log(message);
	});

	return message;
}

exports.sendMessage = sendMessage;
