var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CommentSchema = new Schema({
  content: String,
  author: {type:Schema.Types.ObjectId, ref:'User'},
  date: {type: Date, default: Date.now}
  
});

mongoose.model('Comment', CommentSchema);

