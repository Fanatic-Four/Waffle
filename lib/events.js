var mongoose = require ("mongoose");

var events = [];

var eventID = 0;

var eventSchema = new mongoose.Schema({
  creator: String,
  name: String,
  desc: String,
  attendees: [{
    user : String,
    ticket: String,
  }],
});

function createEvent(creator, name, desc) {

	var mEvent = {
		creator: creator,
		name: name,
		desc: desc,
		id: eventID,
		attendees: []
	};


	var EventModel = mongoose.model('Event', eventSchema);
	var eventdb = new EventModel ({
		creator: creator,
		name: name,
		desc: desc,
		id: eventID,
		attendees: []
	});
	eventdb.save(function (err) {
		if (err) console.log ('Error on save: ' + err);
		else console.log('Successfully saved the user');
	});
	events[eventID++] = mEvent;
	return mEvent;
}

function getEvents() {
	if (!events) {
		return null
	}
	else {
		return events;
	}
}

function addUser(mEvent, user) {
	mEvent.push = user;
}

exports.getEvents = getEvents;
exports.createEvent = createEvent;
exports.addUser = addUser;
