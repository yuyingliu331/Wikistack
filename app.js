var express = require('express');
var app = express();
var morgan = require('morgan');
var pg = require('pg');
var bodyParser = require('body-parser');
var swig = require('swig');
var wikiRouter = require('./routes/wiki');
var models = require('./models');

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('dev'));

// point res.render to the proper directory
app.set('views', __dirname + '/views');
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files
// have it use swig to do so
app.engine('html', swig.renderFile);
// turn of swig's caching
swig.setDefaults({cache: false});

app.use('/wiki', wikiRouter);

models.User.sync({})
.then(function () {
    return models.Page.sync({})
})
.then(function () {
    app.listen(3000, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);
