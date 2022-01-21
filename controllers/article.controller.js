const Article = require('../models/article')

exports.getArticles= async (req,res,next)=>{
    //res.send('in the article route')
    const articles = await Article.find().sort({ createdAt: -1 })  // .find()>>> async. find all articles
    res.render('articles/index', {articles: articles, pageTitle:'All Blogs for Admin' })  // views/articles/index.ejs

}

exports.getById =async (req,res,next)=>{
    //res.send(req.params) // {"id":"61e8fa7e480969e9a8cad279"}
    // res.send(req.params.id)
    const article = await Article.findById(req.params.id)  // .findById() >>> async
    if(article==null) res.redirect('/')  // if there is no article, redirect the user to the home page
    res.render('articles/detail', {article:article , pageTitle:' Article details'})
}

exports.createArticle =  (req, res)=>{
    res.render('articles/create', { article: new Article(), pageTitle:'Create an Article' })
}

exports.postArticle =  async(req,res,next)=>{
    console.log(req.body); // thanks to app.use(express.urlencoded({extended: false}))
    let article = new Article({
        title:req.body.title,
        description: req.body.description,
        
    })
    try{
        // .save() >>> async
        article = await article.save()  // once sucessfully saving to db, assign value to 'article'
        res.redirect(`/articles/${article.id}`)

    }catch(e){
        console.log(e);
        
        res.render('articles/create', {article:article}) //{article:article} >>>  prefill all the fields we jsust entered
    }
}

exports.getEditById = async (req,res,next)=>{
    const article = await Article.findById(req.params.id)
    res.render('articles/edit',{article:article,  pageTitle:' Article editing'})
}

exports.putArticle = async (req,res,next)=>{
    let article = await Article.findById(req.params.id);
    const {title, description}= req.body
    //console.log(req.body);

    article.title=title;
    article.description=description;

    try{
        // .save() >>> async
        await article.save()  // once sucessfully saving to db, assign value to 'article'
        res.redirect(`/articles/${article.id}`)

    }catch(e){
        console.log(e);
        
        res.render('articles/edit', {article:article}) //{article:article} >>>  prefill all the fields we jsust entered
    }
    
}

exports.deleteArticle =  async (req,res,next)=>{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/')

}