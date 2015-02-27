var
        _ = require('underscore'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        User = mongoose.model('User');

module.exports = function(app) {
    app.use('/api/v1/users', router);
    app.use('*', function(req, res) {
        res.status(404).json({error: {message: 'route not found'}});
    });
};

function convertMongoUser(user) {
    //return user.toObject({ transform: true })
    return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        roles: user.roles
    };
}

router.route('/')
        .get(function(req, res, next) {
            var paginate = req.query.ps;
            var pageNumber = req.query.p;
            var by = req.query.by;
            var order = req.query.order;
            var regex = new RegExp(req.query.search, 'i');
            if (order !== 'asc' && order !== 'desc') {
                order = 'asc';
            }
            if (by !== 'id' && by !== 'firstname' && by !== 'lastname') {
                by = 'lastname';
            }

            User.find()
                    .or([{'firstname': regex}, {'lastname': regex}, {'phone': regex}])
                    .sort([[by, order]])
                    .skip((pageNumber - 1) * paginate).limit(paginate)
                    .exec(function(err, users) {
                        if (err)
                            return next(err);
                        res.json(_.map(users, function(user) {
                            return convertMongoUser(user);
                        }));
                    });
        })

        .post(function(req, res, next) {
            var user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                roles: req.body.roles
            });

            user.save(function(err, userSaved) {
                res.status(201).json(convertMongoUser(userSaved));
            });
        });

router.route('/:id')
        .get(function(req, res, next) {
            User.findById(req.params.id, function(err, user) {
                if (user === undefined) {
                    res.status(204).end();
                }
                else {
                    res.json(convertMongoUser(user));
                }


            });
        })

        .put(function(req, res, next) {
            User.findById(req.params.id, function(err, user) {

                if (user === undefined) {
                    res.status(204).end();
                }
                else {
                    user.firstname = req.body.firstname;
                    user.lastname = req.body.lastname;
                    user.phone = req.body.phone;
                    user.roles = req.body.roles;

                    user.save(function(err, userSaved) {
                        res.json(convertMongoUser(userSaved));
                    });
                }

            });
        })

        .delete(function(req, res, next) {
            User.findByIdAndRemove(req.params.id, function(err) {
                res.status(204).end();
            });
        });