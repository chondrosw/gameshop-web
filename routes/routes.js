const { response } = require('express')
const Express = require('express')
const Routes = Express.Router()
const ImagesController = require('../controller/images/images')

//View
Routes.get('/',function(req,res){
    res.render('index')
})
Routes.get('/login',function(req,res){
    res.render('login')
})
Routes.get('/register',function(req,res){
    res.render('register')
})
Routes.get('/register-photo',function(req,res){
    res.render('register-photo')
})
Routes.get('/register-photo-success',function(req,res){
    res.render('register-photo-success')
})
//View
Routes.get('/add-image',function(req,res){
    res.render('addGames');
})
Routes.get('/error',function(req,res){
    res.render('404-not-found')
})
Routes.post('/api/post-image',ImagesController.PostImage)

module.exports = Routes