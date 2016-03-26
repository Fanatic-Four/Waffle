// Someone sends {winning number, eventid, userid, message}
// Find event. Get all users attending that event
// Match winning number to each user's numbers
// Redirect to an XML page to send SMS to winner


function sendMessage(message) {
	console.log("twilio");
	// Twilio Credentials account
	var accountSid = 'AC5fc857fd9e018f5f5cdc52beeb42731e'; 
	var authToken = 'aba4968cac3d53f8ec1cc4aed2e6f4e6'; 
	var client = require('twilio')(accountSid, authToken);

	// client.messages.create({
	//     messagingServiceSid: 'MG3fe2ecaa272f16641c3ea5113e1fb5b2',
	//     from: "+16172022125",
	//     to: "+17322771111",
	//     body: 'Congratulations! You won the raffle at <event> ' + message
	// }, function(err, message) {
	//     console.log(message);
	// });
}

exports.sendMessage = sendMessage;