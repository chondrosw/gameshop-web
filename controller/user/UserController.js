const Mongoose = require('mongoose')
const Usermodel = require('../../model/mongodb/User/User')
exports.Login = async(req,res)=>{
    let dataUser = await Usermodel.findOne({'username':req.body.username})

    if(!dataUser){
        res.send({
            message:"Data not found",
            statusCode:400
        })
    }else{
        let password = cryptr
    }
}