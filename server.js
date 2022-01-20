const express = require('express');
const app = express();
const Article = require('./models/article')



app.set('view engine', 'ejs') //  Set EJS as templating engine
app.set('views','views') // set the name of views folder which we keep static file 'views' (but that is what it set by default, so we don't need to do that)

// take url enclded data comes along for the ride and it passes that into an object that we can use on the request object
// that's for accepting form data. Let use access the data comes along for the ride like POST request
app.use(express.urlencoded({extended: false}))

// as form can only have method 'POST' and "GET", if we want to 'DELETE', we can use [method-override] to override the method that the form uses
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.get('/', async(req, res, next)=>{
    //res.send('hihi')
    /* dummy articles
    const articles = [
        {
            title: 'Test Article 1',
            createdAt: new Date(),
            description: 'test description 1'
        },
        {
            title: 'Test Article 2',
            createdAt: new Date(),
            description: 'test description 2'
        }

    ]
    */

    // .sort({ createdAt: -1 }) 或 .sort({ createdAt: 'desc' })
    const articles = await Article.find().sort({ createdAt: -1 })  // .find()>>> async. find all articles
    res.render('articles/index', {articles: articles})  // views/articles/index.ejs
})


const articleRoutes = require('./routes/articles.route')
app.use('/articles',articleRoutes) // localhost:8000/articles/...

const PORT = process.env.PORT || 8000
// after the connection successfully connected, fire the callback () => { app.listen(PORT)}

const mongoose = require('mongoose');
require('dotenv').config();
const dbURI= process.env.MONGODB_URL
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })   // let mongoose go out and connect to our database
    .then((result)=>app.listen(PORT)) // only listen for requests after connecting to the db
    .catch((err)=> console.log(err))
