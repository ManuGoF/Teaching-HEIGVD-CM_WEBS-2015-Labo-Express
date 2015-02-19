var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
	User = mongoose.model('User'),
	IssueType = mongoose.model('IssueType'),
	Issue = mongoose.model('Issue'),
	Action = mongoose.model('Action');


module.exports = function (app) {
  app.use('/api/data', router);
};

function random (low, high) {
    return Math.random() * (high - low) + low;
}

function randomInt (low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var firstnames = [ 'Alfred', 'Henri', 'Romain', 'Benoit', 'Alain', 'Alex'];
var lastnames = [ 'Dupont', 'Dutoit', 'Ducroc', 'Desportes', 'Terieur' ];

var descriptionsAndComments = [
	'Morbi a odio cursus, finibus lorem ut, pellentesque elit.',
	'Nunc sollicitudin lorem at dolor placerat, eget ornare erat fringilla.',
	'Sed eget ipsum sit amet lacus dictum porttitor at facilisis velit.',
	'Integer at metus vitae erat porta pellentesque.',
	'Pellentesque iaculis ante vestibulum dolor finibus hendrerit.',
	'Mauris tempus orci quis orci lacinia cursus.',
	'Nam semper ligula quis nisl egestas, at pellentesque nunc tincidunt.',
	'Integer venenatis justo ac urna accumsan, eget hendrerit ligula eleifend.',
	'Ut sagittis ipsum sed nisl ultrices rutrum.',
	'Proin pretium lacus nec lectus congue, a finibus elit consequat.',
	'Sed id ligula semper, auctor metus et, mattis tortor.',
	'Aenean non massa quis urna pellentesque pellentesque in nec ex.',
	'Vestibulum non erat venenatis, finibus lorem ac, eleifend eros.',
	'Proin ac mi et turpis volutpat facilisis id eget est.',
 	'Pellentesque mattis quam tincidunt sem rhoncus finibus.'
];

var tags = ['Proin', 'Orci', 'Egestas', 'Lobortis', 'Quam', 'Non', 'Posuere', 'Lorem', 'Etiam'];

var issueStates = [
	'created',
	'acknowledged',
	'assigned',
	'in_progress',
	'solved',
	'rejected'
];

var shortnames = [
	'broken streetlight',
	'dangerous crossroad',
	'graffiti',
	'broken road',
	'racist graffiti',
	'dangerous population'
];

var latitudes = [
	'46.766129',
	'46.784234',
	'47.766129',
	'47.784234',
	'48.766129',
	'48.784234',
	'49.766129',
	'49.784234'
]

var longitudes = [
	'6.651878',
	'6.622009',
	'7.651878',
	'7.622009',
	'8.651878',
	'8.622009',
	'9.651878',
	'9.622009'
]

var users = null;
var citizen = null;
var staff = null;
var issueTypes = null;
var issues = null;

// Yverdon square perimeter (Chamard -> Y-Parc approx)
var minLat = 46.766129;
var maxLat = 46.784234;
var minLng = 6.622009;
var maxLng = 6.651878;

function generateRoles() {
	var roles = [[ 'citizen' ], [ 'staff' ], [ 'citizen', 'staff' ]];
	return roles[randomInt(0, 3)];
}

function generateTags() {
	var data = [];
	for (var i = 0; i < randomInt(1, 10); i++) {
		data.push(tags[randomInt(0, tags.length)]);
	}

	return _.uniq(data);
}

function populateActions(res) {
	// TODO: Implement the issue type generation

	var data = [];
	for (var i = 0; i < 10; i++) {
		data.push({
			// TODO: Implement the action random generation
			type: 'addComment',
			content: descriptionsAndComments[randomInt(0, descriptionsAndComments.length)],
			creatingDate: new Date()
		});
	}
	
	var data2 = [];
	for (var i = 0; i < 20; i++) {
		data2.push({
			// TODO: Implement the action random generation
			type: 'addTag',
			content: tags[randomInt(0, tags.length)],
			creatingDate: new Date()
		});
	}
	
	var data3 = [];
	for (var i = 0; i < 5; i++) {
		data2.push({
			// TODO: Implement the action random generation
			type: 'Réparation',
			content: descriptionsAndComments[randomInt(0, descriptionsAndComments.length)],
			creatingDate: new Date()
		});
	}

	Action.create(data, function(err) {
		actions = Array.prototype.slice.call(arguments, 1);

		Action.create(data2, function(err) {
			actions = Array.prototype.slice.call(arguments, 1);
					
			Action.create(data3, function(err) {
				actions = Array.prototype.slice.call(arguments, 1);
						
				res.status(200).end();
				//res.end();
			});
		});
	});
}	

function populateIssues(res) {
	var creationDate = randomDate(new Date(2012, 0, 1), new Date(2015, 6, 1));

	var data = [];
	for (var i = 0; i < 20; i++) {
		data.push({
			// TODO: Implement the issue random generation
			author: users[randomInt(0, users.length)],
			issueType: issueTypes[randomInt(0, issueTypes.length)],
			description: descriptionsAndComments[randomInt(0, descriptionsAndComments.length)],
			latitude: latitudes[randomInt(0, latitudes.length)],
			longitude: longitudes[randomInt(0, longitudes.length)],
			status: issueStates[randomInt(0, issueStates.length)],
			staffmember: users[randomInt(0, users.length)],
			creatingDate: new Date()
		});
	}

	// TODO: Replace the collection save by the correct call corresponding to your model
	Issue.create(data, function(err) {
		issues = Array.prototype.slice.call(arguments, 1);
		populateActions(res);
	});
}

function populateIssueTypes(res) {
	// TODO: Implement the issue type generation

	var data = [];
	for (var i = 0; i < 10; i++) {
		data.push({
			// TODO: Implement the issuetype random generation
			shortname: shortnames[randomInt(0, shortnames.length)],
			description: descriptionsAndComments[randomInt(0, descriptionsAndComments.length)]
		});
	}
	
	IssueType.create(data, function(err) {
		issueTypes = Array.prototype.slice.call(arguments, 1);
	
		populateIssues(res);
	});
}

function populateUsers(res) {
	var data = [];
	for (var i = 0; i < 15; i++) {
		data.push({
			firstname: firstnames[randomInt(0, firstnames.length)],
			lastname: lastnames[randomInt(0, lastnames.length)],
			phone: '+' + randomInt(1000000, 10000000),
			roles: generateRoles()
		});
	}

	User.create(data, function(err) {
		// Each user is passed one by one as an argument list to the function.
		// Then, retrieve the list with this line.
		var usersCreated = Array.prototype.slice.call(arguments, 1);

		// Save users generated to later use in other data generation
		users = usersCreated;

		// Filter the citizen users for later generations
		citizen = _.where(usersCreated, function(user) {
			return _.contains(user.roles, 'citizen');
		});

		// Filter the staff users for later generations
		staff = _.where(usersCreated, function(user) {
			return _.contains(user.roles, 'staff');
		});

		// TODO: Call other generators as Mongoose is ASYNC and requires callbacks
		populateIssueTypes(res);
	})
}

router.route('/populate')
	.post(function(req, res, next) {
		Action.find().remove(function(err) {
			Issue.find().remove(function(err) {
				IssueType.find().remove(function(err) {
					User.find().remove(function(err) {
						populateUsers(res);
					});
				});
			});
		});
	})
