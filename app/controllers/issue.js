var
        _ = require('underscore'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Issue = mongoose.model('Issue'),
        Action = mongoose.model('Action'),
        Comment = mongoose.model('Comment');

module.exports = function(app) {
    app.use('/api/v1/issues', router);
};

function convertMongoIssue(issue) {
    var staffmember = null;

    if (issue.staffmember !== undefined) {
        staffmember = {"id": issue.staffmember['id'], "firstname": issue.staffmember['firstname'], "lastname": issue.staffmember['lastname'], "phone": issue.staffmember['phone'], "roles": issue.staffmember['roles']};
    }
    return {
        id: issue.id,
        author: {"id": issue.author['id'], "firstname": issue.author['firstname'], "lastname": issue.author['lastname'], "phone": issue.author['phone'], "roles": issue.author['roles']},
        issueType: {"id": issue.issueType['id'], "shortname": issue.issueType['shortname'], "description": issue.issueType['description']},
        description: issue.description,
        latitude: issue.latitude,
        longitude: issue.longitude,
        status: issue.status,
        staffmember: staffmember,
        comments: _.map(issue.comments, function(comment) {
            return {"id": comment.id, "author": comment.author, "comment": comment.content};
        }),
        tags: issue.tags,
        creatingDate: issue.creatingDate,
        closingDate: issue.closingDate
    };
}

function convertMongoIssues(issue) {

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
    var content;
    if (action['type'] === 'addComment') {
        content = {"author": action.content.author, "comment": action.content.content};
    } else {
        content = action.content;
    }
    return {
        id: action.id,
        type: action.type,
        content: content,
        creatingDate: action.creatingDate
    };
}

router.route('/')
        .get(function(req, res, next) {
            var paginate = req.query.ps;
            var pageNumber = req.query.p;
            var author = req.query.author;
            var issueType = req.query.issueType;
            var from = req.query.fromDate;
            var to = req.query.toDate;
            var solved = req.query.solved;
            var query = {};
            if (author !== undefined) {
                query['author'] = author;
            }
            if (issueType !== undefined) {
                query['issueType'] = issueType;
            }
            if (from !== undefined) {
                query['creatingDate'] = {$gt: new Date(from)};
            }
            if (to !== undefined) {
                var toDate = new Date(to);
                toDate.setDate(toDate.getDate() + 1);
                query['creatingDate'] = {$lt: toDate};
            }
            if (from !== undefined && to !== undefined) {
                var toDate = new Date(to);
                toDate.setDate(toDate.getDate() + 1);
                query['creatingDate'] = {$lt: toDate, $gt: new Date(from)};
            }
            if (solved !== undefined) {
                if (solved === 'true') {
                    query['$where'] = 'this.status == "solved"';
                } else if (solved === 'false') {
                    query['$where'] = 'this.status != "solved"';
                }

            }

            Issue.find()
                    .and(query)
                    //.sort([[by, order]])
                    .skip((pageNumber - 1) * paginate).limit(paginate)

                    .exec(function(err, issues) {
                        if (err)
                            return next(err);
                        res.json(_.map(issues, function(issue) {
                            return convertMongoIssues(issue);
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
                status: 'created'

            });

            issue.save(function(err, issueSaved) {
                Issue.findById(issueSaved.id).populate('issueType author staffmember').exec(function(err, issuePopulated) {
                    res.status(201).json(convertMongoIssue(issuePopulated));
                });

            });
        });

router.route('/:id')
        .get(function(req, res, next) {
            Issue.findById(req.params.id).populate('issueType author staffmember comments').exec(function(err, issue) {
                if (issue === undefined) {
                    res.status(404).json({error: {message: 'resource not found'}}).end();
                }
                else {
                    res.json(convertMongoIssue(issue));
                }
            });
        })

        .put(function(req, res, next) {
            Issue.findById(req.params.id).exec(function(err, issue) {
                if (issue === undefined) {
                    res.status(404).json({error: {message: 'resource not found'}}).end();
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
                        Issue.findById(issueSaved.id).populate('issueType author staffmember comments').exec(function(err, issuePopulated) {
                            res.status(201).json(convertMongoIssue(issuePopulated));
                        });
                    });
                }


            });
        })

        .delete(function(req, res, next) {
            Issue.findByIdAndRemove(req.params.id, function(err) {
                res.status(404).end();
            });
        });

router.route('/:id/actions')


        .get(function(req, res, next) {
            Issue.findById(req.params.id).populate('actions').exec(function(err, issue) {
                if (issue === undefined) {
                    res.status(404).json({error: {message: 'resource not found'}}).end();
                }
                else {

                    res.json(_.map(issue.actions, function(action) {
                        return convertMongoAction(action);
                    }));
                }
            });
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
                    Issue.findById(req.params.id).populate('issueType author staffmember comments').exec(function(err, issue) {
                        issue['comments'].push(commentSaved);
                        issue['actions'].push(action);
                        issue.save(function(err, issueSaved) {
                            action.save(function(err, actionSaved) {
                                res.json(convertMongoIssue(issueSaved));
                            });

                        });
                    });

                });


            } else if (action.type === 'addTag') {
                Issue.findById(req.params.id).populate('issueType author staffmember comments').exec(function(err, issue) {
                    issue['tags'].push(action.content['tag']);
                    issue['actions'].push(action);
                    issue.save(function(err, issueSaved) {
                        action.save(function(err, actionSaved) {
                            res.json(convertMongoIssue(issueSaved));
                        });
                    });
                });
            } else if (action.type === 'updateStatus') {
                Issue.findById(req.params.id).populate('issueType author staffmember comments').exec(function(err, issue) {
                    issue.status = action.content['newStatus'];
                    issue['actions'].push(action);
                    issue.save(function(err, issueSaved) {
                        action.save(function(err, actionSaved) {
                            res.json(convertMongoIssue(issueSaved));
                        });
                    });
                });
            } else if (action.type === 'updateStaffmember') {
                Issue.findById(req.params.id).exec(function(err, issue) {
                    issue.staffmember = action.content['newStaffmember'];
                    issue['actions'].push(action);
                    issue.save(function(err, issueSaved) {
                        action.save(function(err, actionSaved) {
                            Issue.findById(req.params.id).populate('issueType author staffmember comments').exec(function(err, issue) {
                                res.json(convertMongoIssue(issue));
                            });
                        });
                    });
                });
            }

        });
