const mongoose = require('mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const User = new mongoose.Schema({
    // method:{ type:String, enum: ['local','google'], required: true },
    // local:{
    //     name:{type: String, trim:true, lowercase:true},
    //     email:{type: String, lowercase: true},
    //     password: String,
    //     photo:String,
    //     req_reset:{type:Boolean, default:false},
    //     reset_token:String
    // },
    // google:{
    //     id:{ type: String },
    //     email:{ type: String, lowercase: true},
    //     photo:String,
    //     fname:String,
    //     lname:String

    // }
    email:{ type: String, required: true },
    name:{ type: String, required: true },
    password:String
    
    
})
User.plugin(mongodbErrorHandler)
module.exports = mongoose.model('user', User)