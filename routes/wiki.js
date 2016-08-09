var express = require('express');
var router = express.Router();
var Promise = require('sequelize').Promise;
module.exports = router; 

var models = require('../models');
var Page = models.Page; 
var User = models.User;

router.get('/',function(req, res, next){
   
    Page.findAll()
    .then(function(val) {
        res.render('index', {pages: val});
    }) 
});

router.get('/users', function(req, res, next) {
  User.findAll({}).then(function(users){
    res.render('users', { users: users });
  }).catch(next);
});

router.get('/users/:id', function(req, res, next){
    Page.findAll({
        where: {
        authorId: req.params.id
       }
    }).then(function(titles){
    res.render('users', { articles: titles });
     }).catch(next);
});

router.post('/',function(req, res, next){
    User.findOrCreate({
  where: {
    name: req.body.name,
    email: req.body.email
  }
})
.then(function (values) {

  var user = values[0];
  var page = Page.build({
    title: req.body.title,
    content: req.body.content
  });

  return page.save().then(function (page) {
    return page.setAuthor(user);
  });

})
.then(function (page) {
  res.redirect(page.route);
})
.catch(next);

    

  


});
router.get('/add',function(req, res, next){
    res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next) {
    Page.findOne({
        where: {
             urlTitle: req.params.urlTitle
            }
    })
    .then(function(val) {
        
        res.render('wikipage', {page: val});
    })
    .catch(next);
});


var getUrlTitle = function(title) {
    title.replace(/ /g, '_');
};

