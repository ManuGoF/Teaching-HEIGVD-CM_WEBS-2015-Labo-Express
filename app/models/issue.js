var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IssueSchema = new Schema({
  author: {type:Schema.Types.ObjectId, ref:'User'},
  issueType: {type:Schema.Types.ObjectId, ref:'IssueType'},
  description: String,
  latitude: String,
  longitude: String,
  status: String,
  staffmember: {type:Schema.Types.ObjectId, ref:'User'},
  creatingDate: {type: Date, default: Date.now},
  closingDate: Date
  
  
});

mongoose.model('Issue', IssueSchema);

