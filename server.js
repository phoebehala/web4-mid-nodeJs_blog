const express = require('express');
const app = express();
const Article = require('./models/article')
const articleRoutes = require('./routes/articles.route');

require('dotenv').config();

const methodOverride = require('method-override');

/*  session */
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

/*  middleware & static files */
// make folder named public public to the browser
app.use(express.static('public'))

app.set('view engine', 'ejs') //  Set EJS as templating engine
app.set('views','views') // set the name of views folder which we keep static file 'views' (but that is what it set by default, so we don't need to do that)

// take url enclded data comes along for the ride and it passes that into an object that we can use on the request object
// that's for accepting form data. Let use access the data comes along for the ride like POST request
app.use(express.urlencoded({extended: false}))

// as form can only have method 'POST' and "GET", if we want to 'DELETE', we can use [method-override] to override the method that the form uses
app.use(methodOverride('_method'));


const store = new MongoDBStore({
    uri: process.env.MONGODB_URL,     // should require('dotenv').config(); first
    collection: 'sessions'
})
// to set session to the req.session, so that it would be persistent through all of the request, response cycles
app.use(session({
    secret: 'key that will sign cookie',   // this Is a Super Secret String
    resave: false,   // for every request to the server, whether we want to create a session or not
    saveUninitialized: false,  // false>> if we didn't touched the session, we don't want it to save
    store:store
}))


const isAuth = (req, res, next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/login')
    }
}

app.get('/', async(req, res, next)=>{
 
    console.log('req.session:',req.session);
    console.log('req.session:',req.session.id);
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
    res.render('home', {articles: articles, pageTitle:'All Blogs' })  // views/home.ejs
})

/* doesn't work well
app.get('/:id', async(req, res, next)=>{
    console.log('req.params:',req.params)
    console.log(req.params.id);
    
    const article = await Article.findById(req.params.id)
    console.log(article);
    //res.send('hi')
    res.render('detailForVisitor', {article: article, pageTitle:'detail for visitor' })
   
})
*/


// only the login user can visit these routes (req.session.isAuth is true)
app.use('/articles',isAuth, articleRoutes) // localhost:8000/articles/...

const authRoute = require('./routes/auth.route');
app.use(authRoute)  // localhost:port/...




app.use((req, res)=>{
    res.status(404).render('404', {pageTitle:'404'})
})


const PORT = process.env.PORT || 8000
// after the connection successfully connected, fire the callback () => { app.listen(PORT)}

const mongoose = require('mongoose');
const dbURI= process.env.MONGODB_URL // should require('dotenv').config(); first
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })   // let mongoose go out and connect to our database
    .then((result)=>app.listen(PORT)) // only listen for requests after connecting to the db
    .catch((err)=> console.log(err))
