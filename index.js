const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const csvParser = require('csv-parser');
const app = express();
const port = 8000;
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');

app.use(express.urlencoded({extended: true}));
app.use(express.static('./assests'));
app.use(expressLayouts);
app.use(cookieparser());
app.use('./uploads', express.static(__dirname + '/uploads'))
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', require('./routes'))
app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
})