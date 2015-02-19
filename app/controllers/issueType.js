var 
_ = require('underscore'),
express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  IssueType = mongoose.model('IssueType');

module.exports = function (app) {
  app.use('/api/issuetypes', router);
};


function convertMongoIssueType(issueType) {
	//return user.toObject({ transform: true })
	return {
		id: issueType.id,
		firstname: issueType.shortname,
		description: issueType.description
	};
}
// on routes that end in /issuetypes
// ----------------------------------------------------
router.route('/')
    
    // get all the issuetypes (accessed at GET http://localhost:3000/api/issuetypes)
	.get(function(req, res, next) {
		IssueType.find(function (err, issueTypes) {
		  if (err) return next(err);
		  res.json(_.map(issueTypes, function(issueType) {
				return convertMongoIssueType(issueType);
			}));
		});
	})

    // create a issuetype (accessed at POST http://localhost:3000/api/issuetype)
	.post(function (req, res, next) {
		var issueType = new IssueType({
			shortname: req.body.shortname,
			description: req.body.description
		});

		issueType.save(function(err, issueTypeSaved) {
			res.status(201).json(convertMongoIssueType(issueTypeSaved));
		});
	});

// on routes that end in /issuetypes/:issuetype_id
// ----------------------------------------------------
router.route('/:id')

    // get the issuetype with that id (accessed at GET http://localhost:3000/api/issuetypes/:issuetype_id)
	.get(function(req, res, next) {
		IssueType.findById(req.params.id, function(err, issueType) {
			res.json(convertMongoIssueType(issueType));
		});
	})

    // update the issuetype with this id (accessed at PUT http://localhost:3000/api/issuetypes/:issuetype_id)
	.put(function(req, res, next) {
		IssueType.findById(req.params.id, function(err, issueType) {
			issueType.shortname = req.body.shortname;
			issueType.description = req.body.description;


			issueType.save(function(err, issueTypeSaved) {
				res.json(convertMongoIssueType(issueTypeSaved));
			});
		});
	})

    // delete the issuetype with this id (accessed at DELETE http://localhost:3000/api/issuetypes/:issuetype_id)
	.delete(function(req, res, next) {
		IssueType.findByIdAndRemove(req.params.id, function(err) {
			res.status(204).end();
		});
	});

