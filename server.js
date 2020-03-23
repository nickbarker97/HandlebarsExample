var express = require('express');
var app = express();

app.get('/', (req, res)=>{
    res.send('This is the Home Page')
});

app.get('/about', (req, res)=>{
    res.send('This is the About page')
});

app.get('/contact', (req, res)=>{
    res.send('This is the contact page')
});



//Listening for request on port 3000
app.listen(3000,() => {
    console.log('Server listening on port 3000');
});