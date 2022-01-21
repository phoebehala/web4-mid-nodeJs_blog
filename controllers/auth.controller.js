const User = require('../models/user.model');

// to encrypt // to hash password
const bcrypt = require('bcrypt')



exports.getLogin = (req,res,next) => {

    // views: auth/login.ejs
    res.render('auth/login', {
        pageTitle: 'Login'
    })
}

exports.postLogin = (req,res,next) => {
    console.log('input for login:',req.body);
    const {username, email, password} = req.body

    User.findOne({email:email}, (err, user)=>{
        if(err) console.log(err);

        if(!user){
            console.log('no such user');
            return res.redirect('/login')
        }

        // if found one
        // decrypt hash password to compare with encrypted password
        bcrypt.compare(password, user.password).then((isMatching) => {
            console.log('isMatching?',isMatching);
            if(!isMatching){
               
                return res.redirect('/login')
                      
            }
            req.session.isAuth = true;
            res.redirect('/articles')

        }).catch(err => {
            console.log(err)
        })

    })



} 


exports.getSignUp = (req,res,next) => {
    res.render('auth/signup', {
        pageTitle: 'Sign Up'
    })
} 

exports.postSignup = async (req,res,next) => {
    console.log('input for sign up :',req.body);

    const {username, email, password, confirmPassword} =req.body

    let user = await User.findOne({email:email}) // find by email 

    // email already been taken
    if(user){
        res.redirect('/signup')
    }else{
        if (password===confirmPassword){
    
            // to hash password then await the user info saving to the db
            await bcrypt.hash(password, 12).then((hashedPassword)=>{
                const user = new User({
                    username:username,
                    email:email,
                    password:hashedPassword
                })
                return user.save()
            }).then(()=>{
                res.redirect('/login')
            }).catch(err => {
                console.log(err)
            })
        }else{
            res.redirect('/signup')
        }

    }

} 

exports.postLogout = (req, res, next)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/');
    })
}

