var express = require('express');
var app = express();
var handlebars = require('express-handlebars');


app.set('view engine','hbs');
app.engine('hbs',handlebars({
layoutDir: __dirname + '/views/layouts',
extname: 'hbs'
}));
app.get('/', (req, res)=>{
    res.render('index', {layout: 'main'});
});

app.get('/about', (req, res)=>{
    res.render('about', {layout: 'main'});
});

app.get('/contact', (req, res)=>{
    res.send('This is the contact page')
});



//Listening for request on port 3000
app.listen(3000,() => {
    console.log('Server listening on port 3000');
});