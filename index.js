const express = require('express');
const app = express();
const mongoose = require('mongoose')
const User = require('./models/user');
const ejs = require('ejs')
const bcrypt = require('bcrypt');
const session = require('express-session');


mongoose.connect('mongodb://127.0.0.1:27017/Auth')
.then(()=> {
    console.log('Successfully Connection');
})
.catch((err) => {
    console.error(err)
})

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'malekSecret',
    resave: false,
    saveUninitialized: true
}))


const requireLogin = (req,res,next) => {
    if(!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

/* Routers */

app.get('/', (req,res) => {
    res.send('HomePage');
})

app.get('/register', (req,res) => {
    res.render('register');
})

app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    //const hashPwd = await bcrypt.hash(password,12); // old option. the new option look at the user.js we created a middleware
    const user = new User({ username,password })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/')
})

app.get('/login', (req,res) => {
    res.render('login')
})

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    /*
    const user = await User.findOne({ username });
    const validPwd = await bcrypt.compare(password, user.password);
    */ // old one.
    const validUsr = await User.findAndValidate(username,password);
    if(validUsr) {
        req.session.user_id = validUsr._id;
        res.redirect('/secret')
    } else {
        res.redirect('/login')
    }
})

app.post('/logout', (req,res) => {
    req.session.user_id = null; // the particulr one
    // req.session.destroy() // for delete all the sessions
    res.redirect('/login')
})

app.get('/secret',requireLogin ,(req,res) => {
        res.render('secret')
});

app.get('/admin',requireLogin ,(req,res) => {
    res.send('Hello')
})


app.listen(5050, () => {
    console.log('the server is running now')
})