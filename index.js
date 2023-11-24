const express = require('express');
const app = express();
const mongoose = require('mongoose')
const User = require('./models/user');
const ejs = require('ejs')
const bcrypt = require('bcrypt')


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



/* Routers */

app.get('/', (req,res) => {
    res.send('HomePage');
})

app.get('/register', (req,res) => {
    res.render('register');
})

app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    const hashPwd = await bcrypt.hash(password,12);
    const user = new User({
        username,
        password: hashPwd
    })
    await user.save();
    res.redirect('/')
})

app.get('/login', (req,res) => {
    res.render('login')
})

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({ username });
    const validPwd = await bcrypt.compare(password, user.password);
    if(validPwd) {
        res.redirect('/secret')
    } else {
        res.send('Incorrect cradential')
    }
})

app.get('/secret', (req,res) => {
    res.send('MaLeK');
});


app.listen(5050, () => {
    console.log('the server is running now')
})