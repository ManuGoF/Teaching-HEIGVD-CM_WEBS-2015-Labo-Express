var 
_ = require('underscore'),
express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

module.exports = function (app) {
  app.use('/api/v1', router);
};

router.get('/',function(req,res){
    res.json({date: new Date, authors: 'Emmanuel Bezençon and Cedric Liengme', version: '1.0'});
});