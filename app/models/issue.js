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



UserSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Issue', IssueSchema);

