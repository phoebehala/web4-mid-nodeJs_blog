const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    // markdown: {
    //     type: String,
    //     required: true
    // },
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

// model('the model name which s/b the singular of the collection name ', Schema )
// 'Article' >>> it's gonna pluralize based on the model name and look for that collection (articles) 
module.exports =mongoose.model('Article', articleSchema); 