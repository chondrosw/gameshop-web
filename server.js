const Express = require('express')
const App = Express()
const PORT = 8000
const Morgan = require('morgan')
const Dotenv = require('dotenv')
const Cors = require('cors')

App.set("view engine","ejs")
App.use(Express.json())
App.use(Express.urlencoded({extended:true}))
Dotenv.config({path:'./config/Config.env'})
//Connect MongoDB
const ConnectMongoDB = require('./model/mongodb/Connection')
ConnectMongoDB()
App.listen(PORT,function(){
    console.log("Server is running")
})
App.use(Express.static('public'))

const Routing = require('./routes/routes')
const {extend} = require('jquery')

App.use(Routing)
