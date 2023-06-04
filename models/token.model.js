
const mongoose = require("mongoose");

const Token = mongoose.model('Token', new mongoose.Schema({
    token: String,
    authenticated: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }));
  
  module.exports = Token