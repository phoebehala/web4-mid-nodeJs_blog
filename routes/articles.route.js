const express =require('express');
const router = express.Router()
const Article = require('../models/article')

router.get('/', (req,res,next)=>{
    res.send('in the article route')
})


router.get('/create', (req,res,next)=>{
    res.render('articles/create',{article:new Article()})
})

router.get('/:id', async (req,res,next)=>{
    //res.send(req.params) // {"id":"61e8fa7e480969e9a8cad279"}
    // res.send(req.params.id)
    const article = await Article.findById(req.params.id)  // .findById() >>> async
    if(article==null) res.redirect('/')  // if there is no article, redirect the user to the home page
    res.render('articles/detail', {article:article})

})


router.post('/create', async(req,res,next)=>{
    console.log(req.body); // thanks to app.use(express.urlencoded({extended: false}))
    let article = new Article({
        title:req.body.title,
        description: req.body.description,
        markdown:req.body.markdown,
        
    })
    try{
        // .save() >>> async
        article = await article.save()  // once sucessfully saving to db, assign value to 'article'
        res.redirect(`/articles/${article.id}`)

    }catch(e){
        console.log(e);
        
        res.render('articles/create', {article:article}) //{article:article} >>>  prefill all the fields we jsust entered
    }
})

router.get('/edit/:id', async (req,res,next)=>{
    const article = await Article.findById(req.params.id)
    res.render('articles/edit',{article:article})
})

router.put('/edit/:id',async (req,res,next)=>{
    let article = await Article.findById(req.params.id);
    const {title, description, markdown}= req.body
    //console.log(req.body);

    article.title=title;
    article.description=description;
    article.markdown=markdown;

    try{
        // .save() >>> async
        await article.save()  // once sucessfully saving to db, assign value to 'article'
        res.redirect(`/articles/${article.id}`)

    }catch(e){
        console.log(e);
        
        res.render('articles/edit', {article:article}) //{article:article} >>>  prefill all the fields we jsust entered
    }
    
})



// form method only allow us to 'POST' or 'GET'
router.delete('/:id', async (req,res,next)=>{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/')

})

module.exports = router