const { response } = require('express')
const Mongoose = require('mongoose')
const Usermodel = require('../../model/mongodb/User/User')
const JWT = require('jsonwebtoken')
const Cryptr = new require('cryptr')
const cryptr = new Cryptr(process.env.SecretKey)
exports.Login = async(req,res)=>{
    let dataUser = await Usermodel.findOne({'username':req.body.username}).then(response=>response).catch(err =>false)
    
    if(!dataUser){
        res.send({
            message:"Data not found",
            statusCode:400
        })
    }else{
       let Password = cryptr.decrypt(dataUser.password)
       if( Password != req.body.password){
           res.send({
               message:'Wrong username or password',
               statusCode:400
           })
       }else{
           let createToken = JWT.sign({UID:dataUser.id,username:dataUser.username,email:dataUser.email}
            ,process.env.SecretKey,
            {expiresIn:'1h'})

            let DataPassing = {
                username:dataUser.username,
                fullname:dataUser.fullname,
                email:dataUser.email,
                tokenType:'Bearer',
                token:createToken
            }
            res.send({
                message:'Successfull to login',
                statusCode:200,
                results:DataPassing
            })
       }
    }
}

exports.Create = async(req,res)=>{
    if(!req.body){
        res.send(400)
    }
    let dataFind = await Usermodel.findOne({'username':req.body.username}).then(response=>false).catch(err=>true)
    if(dataFind){
        res.send({
            message:"Already Exist",
            statusCode:500
        })
    }else{
        if(req.body.type == "" || req.body.type == null){
            const newUserModel = new Usermodel({
                username:req.body.username,
                password:cryptr.encrypt(req.body.password),
                fullname:req.body.fullname,
                email:req.body.email,
                type:"User",
                money:0,
                photo:""
            })
        }
        
    }
}