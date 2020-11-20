const mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = UserSchema = mongoose.model('user', UserSchema)