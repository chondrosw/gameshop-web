const { response } = require('express')
const Express = require('express')
const Routes = Express.Router()
const UserController = require('../controller/user/UserController')
const ImagesController = require('../controller/images/images')

//View
Routes.get('/home',function(req,res){
    res.render('home')
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
Routes.get('/overview',function(req,res){
    res.render('overview')
})
//View

//Api

Routes.post('/api/register',UserController.Create)
Routes.put('/api/user-photo',UserController.UploadPicture)

//Api
Routes.get('/add-image',function(req,res){
    res.render('addGames');
})
Routes.get('/error',function(req,res){
    res.render('404-not-found')
})
Routes.post('/api/post-image',ImagesController.PostImage)

module.exports = Routes