var 
_ = require('underscore'),
express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Action = mongoose.model('Action');

module.exports = function (app) {
  app.use('/api/v1/actions', router);
};


function convertMongoAction(action) {
	//return user.toObject({ transform: true })
	return {
		id: action.id,
		type: action.type,
		content: action.content,
		creatingDate: action.creatingDate
	};
}
// on routes that end in /contents
// ----------------------------------------------------
router.route('/')
    
    // get all the actions (accessed at GET http://localhost:3000/api/actions)
	.get(function(req, res, next) {
		Action.find(function (err, actions) {
		  if (err) return next(err);
		  res.json(_.map(actions, function(action) {
				return convertMongoAction(action);
			}));
		});
	});

