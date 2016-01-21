var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
  started_at: Date,
  users: Array,
  state: String
});

module.exports = mongoose.model('Game', GameSchema);