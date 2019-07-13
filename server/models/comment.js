const mongoose = require('mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const Comment = new mongoose.Schema({
    name:String,
    comment:String,
    time:{default:Date.now()}
})
Comment.plugin(mongodbErrorHandler)
module.exports = mongoose.model('comment', Comment)