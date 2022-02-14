const Mongoose = require('mongoose')
//Connect to Database with Mongodb
const ConnectDB = async()=>{
    try{
        const connect = await Mongoose.connect(process.env.MONGODB_CLIENT,{useNewUrlParser: true, useUnifiedTopology: true})
        
    }catch(err){
       
    }
}
module.exports = ConnectDB