var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('Issue');

module.exports = function (app) {
  app.use('/api/issues', router);
};

function convertMongoIssue(issue) {
	//return user.toObject({ transform: true })
	return {
		id: issue.id,
		author: issue.author,
		issueType: issue.issueType,
		description: issue.description,
		latitude: issue.latitude,
		longitude: issue.longitude,
		status: issue.status,
		staffmember: issue.staffmember,
		creatingDate: issue.creatingDate,
		closingDate: issue.closingDate
	}
}

