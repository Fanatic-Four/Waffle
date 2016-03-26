var mongoose = require ("mongoose");

var events = [];

var eventID = 0;

function createEvent(creator, name, desc, user) {

	var mEvent = {
		creator: creator,
		name: name,
		desc: desc,
		id: eventID,
		attendees: []
	};

	var eventSchema = new mongoose.Schema({
		creator: {type : mongoose.Schema.ObjectId, ref : 'User'},
		name: String,
		desc: String,
		attendees: [{
			user : {type : mongoose.Schema.ObjectId, ref : 'User'},
			ticket: String,
		}],
	});

	var EventModel = mongoose.model('Event', eventSchema);
	var eventdb = new EventModel ({
		creator: creator,
		name: name,
		desc: desc,
		id: eventID,
		attendees: []
	});
	eventdb.save(function (err) {
		if (err) console.log ('Error on save!')
		else console.log('Successfully saved the user')
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
