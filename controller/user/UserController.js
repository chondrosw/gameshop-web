const { response } = require('express')
const Mongoose = require('mongoose')
var cookieParser = require('cookie-parser')
const Usermodel = require('../../model/mongodb/User/User')
const JWT = require('jsonwebtoken')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.SecretKey)
const RandomString = require('../../module/randomstring')
const Path = require('path')
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
            
        let createToken = JWT.sign(
            { UID: dataUser._id, Username: dataUser.username, Email: dataUser.email },
            process.env.SecretKey,
            { expiresIn: '1h' }
        )

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

    let{password,username,email,fullname} = req.body
    if(!req.body){
        res.send(400)
    }
    const dataFind = await Usermodel.findOne({'username':username})
    console.log(dataFind)
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
            let createToken = JWT.sign(
                {  username: req.body.username, email: req.body.email },
                process.env.SecretKey,
                { expiresIn: '1h' }
            )
            let dataParsing = {
                username:req.body.username,
                fullname:req.body.fullname,
                type:"User",
                tokenType:"Bearer",
                token:createToken
            }
             await newUserModel.save(newUserModel).then(response=>{
                res.send({
                    message: "Success Register account",
                    statusCode:200,
                    results:dataParsing
                })
            }).catch(err =>{
                res.send({
                    message:"Error Create Account",
                    statusCode:400
                })
            })
            
        }else{
            const newUserModel = new Usermodel({
                username:req.body.username,
                password:cryptr.encrypt(req.body.password),
                fullname:req.body.fullname,
                email:req.body.email,
                type:req.body.type,
                money:0,
                photo:""
            })
            let createToken = JWT.sign(
                {  username: req.body.username, email: req.body.email },
                process.env.SecretKey,
                { expiresIn: '1h' }
            )
            let dataParsing = {
                username:req.body.username,
                fullname:req.body.fullname,
                type:req.body.type,
                tokenType:"Bearer",
                token:createToken
            }
             await newUserModel.save(newUserModel).then(response=>{
                res.send({
                    message: "Success Register account",
                    statusCode:200,
                    results:dataParsing
                })
            }).catch(err =>{
                res.send({
                    message:"Error Create Account",
                    statusCode:400
                })
            })
        }
        
    }
}

exports.UploadPicture = async(req,res)=>{
    
    let tokenAuth = req.params
    console.log(tokenAuth);
    let resultToken = await JWT.verify(tokenAuth,process.env.SecretKey,function(err,resultToken){
        if(err) return false
        if(resultToken) return resultToken
    })
    console.log(resultToken)

    // if(!resultToken){
    //     res.send(403)
    // }else{
    //     console.log(resultToken)
    //     let data = req.files.imagesData
    //     let domain = req.get('host') + '/images' + data

    //     if(data.mimetype.includes('image')){
    //         res.send({
    //             statusCode:400
    //         })
    //     }else{
            
            
    //         let newName = RandomString(25) + data.mimetype.replace('images/',".")
    //         let dirName = Path.join(__dirname, '../../public')
    //         data.mv(dirName + '/images/' + newName,function(err,result){
    //             if(err) console.log(err)
    //             if(result) console.log('Success')
    //         })

    //         let doc = await Usermodel.findOneAndUpdate({"username":resultToken.username},{"photo":newName},{new:true})
    //          await doc.save();
    //          console.log(doc)


    //     }
        
    // }
}