const mongoose = require('mongoose')
const { Schema } = mongoose

const UserCollectionSchema = new Schema({
  email: String,
  pass: String,
  secret: String,
})

const model = mongoose.model('UserCollection', UserCollectionSchema)

module.exports = model