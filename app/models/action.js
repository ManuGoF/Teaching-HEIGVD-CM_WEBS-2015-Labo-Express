var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ActionSchema = new Schema({
  type: String,
  content: {},
  creatingDate: {type: Date, default: Date.now}, 
});

mongoose.model('Action', ActionSchema);

