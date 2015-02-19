// app/models/issueType.js

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IssueTypeSchema = new Schema({
  shortname: String,
  description: String
});

module.exports = mongoose.model('IssueType', IssueTypeSchema);


