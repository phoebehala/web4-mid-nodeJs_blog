const mongoose = require('mongoose')
const Schema = mongoose.Schema

// instantiate Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true   
    }
})

// mongoose.model() >>> to convert the schema to a model
// mongoose.model('collection name(sigular with capitalized letter ', schema) 
module.exports = mongoose.model('User', userSchema)  // 'collection name' will be pluralized in db

