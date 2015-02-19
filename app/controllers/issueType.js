var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  IssueType = mongoose.model('IssueType');

module.exports = function (app) {
  app.use('/api/issuetypes', router);
};

// on routes that end in /issuetypes
// ----------------------------------------------------
router.route('/')
    
    // get all the issuetypes (accessed at GET http://localhost:3000/api/issuetypes)
    .get(function(req, res) {
        IssueType.find(function(err, issuetypes) {
            if (err)
                res.send(err);

            res.json(issuetypes);
        });
    })

    // create a issuetype (accessed at POST http://localhost:3000/api/issuetype)
    .post(function(req, res) {
        
        var issuetype = new IssueType();      // create a new instance of the IssueType model
        issuetype.shortname = req.body.shortname;  // set the issuetypes name (comes from the request)
        issuetype.description = req.body.description;  // set the issuetypes name (comes from the request)


        // save the issuetype and check for errors
        issuetype.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Issuetype created!' });
        });
        
    });

// on routes that end in /issuetypes/:issuetype_id
// ----------------------------------------------------
router.route('/:issuetype_id')

    // get the issuetype with that id (accessed at GET http://localhost:3000/api/issuetypes/:issuetype_id)
    .get(function(req, res) {
        IssueType.findById(req.params.issuetype_id, function(err, issuetype) {
            if (err)
                res.send(err);
            res.json(issuetype);
        });
    })

    // update the issuetype with this id (accessed at PUT http://localhost:3000/api/issuetypes/:issuetype_id)
    .put(function(req, res) {

        // use our issuetype model to find the issuetype we want
        IssueType.findById(req.params.issuetype_id, function(err, issuetype) {

            if (err)
                res.send(err);

            //var issuetype = new IssueType();      // create a new instance of the IssueType model
            issuetype.shortname = req.body.shortname;  // update the issuetypes info
            issuetype.description = req.body.description;  // update the issuetypes info

            // save the issuetype
            issuetype.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Issuetype updated!' });
            });

        });
    })

    // delete the issuetype with this id (accessed at DELETE http://localhost:3000/api/issuetypes/:issuetype_id)
    .delete(function(req, res) {
        IssueType.remove({
            _id: req.params.issuetype_id
        }, function(err, issuetype) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
/*
// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/api', function(req, res) {
    res.json({ message: 'Les routes fonctionnent' });   
});
*/
