const Express = require('express')
const App = Express()
const PORT = 8000
const cookieParser = require('cookie-parser')
const path = require('path')
const Morgan = require('morgan')
const Dotenv = require('dotenv')
const cors = require('cors')
var dir = path.join(__dirname,'public')
App.set("view engine","ejs")
App.use(Express.json())
App.use(cookieParser())
App.use(Express.urlencoded({extended:true}))
Dotenv.config({path:'./config/Config.env'})
//Connect MongoDB
const ConnectMongoDB = require('./model/mongodb/Connection')
ConnectMongoDB()
App.listen(PORT,function(){
    console.log("Server is running")
})
App.use(Express.static(dir))

const Routing = require('./routes/routes')
const {extend} = require('jquery')

App.use(Routing)
