var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IssueSchema = new Schema({
  author: Object,
  issueType: Object,
  description: String,
  latitude: String,
  longitude: String,
  status: String,
  staffmember: Object,
  creatingDate: Date,
  closingDate: Date
  
  
});

mongoose.model('Issue', IssueSchema);

