var
        _ = require('underscore'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Issue = mongoose.model('Issue'),
        Action = mongoose.model('Action'),
        Comment = mongoose.model('Comment');

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
    };
}

function convertMongoComment(comment) {
    return {
        id: comment.id,
        author: comment.author,
        content: comment.content
    };
}

function convertMongoAction(action) {
    //return user.toObject({ transform: true })
    return {
        id: action.id,
        type: action.type,
        content: action.content,
        creatingDate: action.creatingDate
    };
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
                staffmember: req.body.staffmember
            });

            issue.save(function(err, issueSaved) {
                res.status(201).json(convertMongoIssue(issueSaved));
            });
        });

router.route('/:id')
        .get(function(req, res, next) {
            Issue.findById(req.params.id).populate('issueType author staffmember').exec(function(err, issue) {
                if (issue === null) {
                    res.status(204).end();
                }
                else {
                    res.json(convertMongoIssue(issue));
                }
            });
        })

        .put(function(req, res, next) {
            Issue.findById(req.params.id, function(err, issue) {
                if (issue === null) {
                    res.status(204).end();
                }
                else {
                    issue.author = req.body.author;
                    issue.issueType = req.body.issueType;
                    issue.description = req.body.description;
                    issue.latitude = req.body.latitude;
                    issue.longitude = req.body.longitude;
                    issue.status = req.body.status;
                    issue.staffmember = req.body.staffmember;

                    issue.save(function(err, issueSaved) {
                        res.json(convertMongoIssue(issueSaved));
                    });
                }


            });
        })

        .delete(function(req, res, next) {
            Issue.findByIdAndRemove(req.params.id, function(err) {
                res.status(204).end();
            });
        });

router.route('/:id/actions')

        .get(function(req, res, next) {
            Issue.findById(req.params.id)
                .populate('actions')
                .exec(function(err,issue) {
                if (issue === null) {
                    res.status(204).end();
                }
                else {
                    res.json(_.map(issue.actions, function(action) {
                        return convertMongoAction(action);
                    }))
                }
            })
        })

        .post(function(req, res, next) {
            var action = new Action({
                type: req.body.type,
                content: req.body.content
            });

            if (action.type === "addComment") {
                var comment = new Comment({
                    author: action.content['author'],
                    content: action.content['comment']
                });
                comment.save(function(err, commentSaved) {
                    Issue.findById(req.params.id).exec(function(err, issue) {
                        issue['comments'].push(commentSaved);
                        issue['actions'].push(action);
                        console.log(issue);
                        issue.save(function(err, issueSaved) {
                            res.json(convertMongoIssue(issueSaved));
                        });
                    });

                });


            } else if (action.type === 'addTag') {
                Issue.findById(req.params.id).exec(function(err, issue) {
                    issue['tags'].push(action.content['tag']);
                    console.log(issue);
                    issue.save(function(err, issueSaved) {
                        res.json(convertMongoIssue(issueSaved));
                    });
                });
            }




        });
