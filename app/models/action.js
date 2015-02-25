var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ActionSchema = new Schema({
  type: String,
  issue: {type:Schema.Types.ObjectId, ref:'Issue'},
  content: {},
  creatingDate: {type: Date, default: Date.now}, 
});

mongoose.model('Action', ActionSchema);

