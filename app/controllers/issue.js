var
        _ = require('underscore'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Issue = mongoose.model('Issue');

module.exports = function(app) {
    app.use('/api/issues', router);
};

function convertMongoIssue(issue) {
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

router.route('/')
        .get(function(req, res, next) {
            Issue.find().populate('issueType author staffmember').exec(function(err, issues) {

                if (err)
                    return next(err);
                res.json(_.map(issues, function(issue) {
                    return convertMongoIssue(issue);
                }));
            });
        })

        .post(function(req, res, next) {
            var issue = new Issue({
                author: req.body.author,
                issueType: req.body.issueType,
                description: req.body.description,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                status: req.body.status,
                staffmember: req.body.staffmember,
                
            });

            issue.save(function(err, issueSaved) {
                res.status(201).json(convertMongoIssue(issueSaved));
            });
        });


;

