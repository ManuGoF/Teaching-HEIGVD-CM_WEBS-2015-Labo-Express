var
        _ = require('underscore'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        User = mongoose.model('User');

module.exports = function(app) {
    app.use('/api/v1/users', router);
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
            User.find(function(err, users) {
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
                if (user === null) {
                    res.status(204).end();
                }
                else {
                    res.json(convertMongoUser(user));
                }


            });
        })

        .put(function(req, res, next) {
            User.findById(req.params.id, function(err, user) {

                if (user === null) {
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