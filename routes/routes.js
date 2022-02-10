const { response } = require('express')
const Express = require('express')
const Routes = Express.Router()
const ImagesController = require('../controller/images/images')

Routes.get('/add-image',function(req,res){
    res.render('addGames');
})
Routes.post('/api/post-image',ImagesController.PostImage)

module.exports = Routes