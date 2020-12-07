var express = require('express');
var app = express();

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var handlebars = require('express-handlebars');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var session = require('express-session');
require('./middleware/passport')(passport);

var { isAuth } = require('./middleware/isAuth');

const Contact = require('./models/Contact');
const User = require('./models/User');

app.set('view engine','hbs');

app.engine('hbs',handlebars({
layoutDir: __dirname + '/views/layouts',
extname: 'hbs'
}));

app.use(express.static('public'));
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend:false}));

app.get('/', (req, res) => {
    res.render('login', {layout: 'main'});
});

app.get('/dashboard', isAuth, (req, res)=>{
    Contact.find({ user: req.user.id }).lean()
    .exec((err,contacts) =>{
        if(contacts.length){
            res.render('dashboard', {layout: 'main', contacts: contacts, contactsExist: true, username: req.user.username });
        } else{
            res.render('dashboard', {layout: 'main', contacts: contacts, contactsExist: false, username: req.user.username });
        }
    })
});

app.post('/addcontact', (req, res)=>{
    const {name, email, number } = req.body;
    var contact = new Contact({
        user: req.user.id,
        name,
        email,
        number
    })
    contact.save();
    res.redirect('/dashboard');
});

app.post('/signup', async(req, res)=>{
    const {username, password } = req.body;
    try{
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).render('login', {layout: 'main', userExist: true});
        } 
        user = new User({
            username,
            password
        });

        //Salt Generation
        const salt = await bcrypt.genSalt(10);

        //Password Encryption using password and salt
        user.password = await bcrypt.hash(password, salt);
    
        await user.save();
        res.status(200).render('login', {layout: 'main', userDoesNotExist: true});
    } catch (err){
        console.log(err.message);
        res.status(500).send('Server Error')
    }
});

app.post('/signin', (req, res, next) =>{
    try{
    passport.authenticate('local', {
        successRedirect:'/dashboard',
        failureRedirect: '/'
    })(req, res, next)
    } catch (err){
        console.log(err.message);
        res.status(500).send('Server Error')
    }
});

app.get('/signout', (req, res) => {
    req.logout();
    res.redirect('/');
});


mongoose.connect('mongodb+srv://Admin:Password123@cluster1.jzx7c.mongodb.net/contactManager?retryWrites=true&w=majority',{
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => {
    console.log('Connected to DB');
})
.catch((err) => {
console.log('Not Connected to the DB with err : ' + err);
})

//Listening for request on port 3000
app.listen(3000,() => {
    console.log('Server listening on port 3000');
});