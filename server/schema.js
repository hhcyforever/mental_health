let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  create_time: String
});

mongoose.model('User', UserSchema);
