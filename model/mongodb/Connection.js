const Mongoose = require('mongoose')
//Connect to Database with Mongodb
const ConnectDB = async()=>{
    try{
        const connect = await Mongoose.connect(process.env.MONGODB_CLIENT,{useNewUrlParser: true, useUnifiedTopology: true})
        console.log("MongoDB Connected" + connect.connection.host)
    }catch(err){
        console.log(err)
    }
}
module.exports = ConnectDB