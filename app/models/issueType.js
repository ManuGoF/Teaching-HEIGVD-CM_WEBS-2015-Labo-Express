// app/models/issueType.js

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IssueTypeSchema = new Schema({
  shortname: String,
  description: String
});

/*
IssueTypeSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });
*/

module.exports = mongoose.model('IssueType', IssueTypeSchema);


