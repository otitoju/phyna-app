const mongoose = require('mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const Recipe = new mongoose.Schema({
    name:{type: String, trim:true},
    ingredient:String,
    procedure:String,
    comment:[{ type: mongoose.Schema.Types.ObjectId, ref:'comment'}]
})
Recipe.plugin(mongodbErrorHandler)
module.exports = mongoose.model('recipe', Recipe)