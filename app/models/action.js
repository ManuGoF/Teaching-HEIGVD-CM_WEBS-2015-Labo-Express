var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ActionSchema = new Schema({
  type: String,
  content: String,
  creatingDate: Date
  
  
});

mongoose.model('Action', ActionSchema);

