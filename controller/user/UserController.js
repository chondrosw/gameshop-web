const { response } = require('express')
const Mongoose = require('mongoose')
var cookieParser = require('cookie-parser')
const Usermodel = require('../../model/mongodb/User/User')
const ImageModel = require('../../model/mongodb/Images/Images')
const JWT = require('jsonwebtoken')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.SecretKey)
const RandomString = require('../../module/randomstring').RandomString
const JWTModule = require('../../module/checkAuth')
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
            {  Username: dataUser.username, Email: dataUser.email },
            process.env.SecretKey,
            { expiresIn: '1h' }
        )

            let DataPassing = {
                username:dataUser.username,
                fullname:dataUser.fullname,
                email:dataUser.email,
                type:"User",
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

    let{password,username,email,fullname,type} = req.body
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
        if(type == "" || type == null){
            const newUserModel = new Usermodel({
                username:req.body.username,
                password:cryptr.encrypt(password),
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
                type:type,
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
                type:type,
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
exports.SearchDataUser = async(req,res)=>{
    let Token = await JWTModule.JWTVerify(req.headers)
    if (!Token) res.send({ message: `failed to get data, dont have access`, statusCode: 403 })
    await Usermodel.find({"username":{$regex:`.*${req.query.search}`}}).then(response=>{
        res.send({
            message:'Successfule to search user',
            statusCode:200,
            results:response
        })
    }).catch(err =>{
        res.send({
            message:'Failed to search data',
            statusCode:500
        })
    })

}
exports.GetDataDeveloperGame =  async(req,res)=>{
    let Token = await JWTModule.JWTVerify(req.headers)
    if (!Token) res.send({ message: `failed to get data, dont have access`, statusCode: 403 })
    await Usermodel.find({"type":"Developer"}).then(response =>{
        res.send({
            message:"Successfull to get data user",
            statusCode:200,
            results:response
        })
    }).catch(err =>{
        res.send({
            message:"Failed to get data user",
            statusCode:500
        })
    })
}
exports.GetDataUser = async(req,res)=>{
    let Token = await JWTModule.JWTVerify(req.headers)
    if (!Token) res.send({ message: `failed to get data, dont have access`, statusCode: 403 })
    await Usermodel.find({"type":"User"}).then(response =>{
        res.send({
            message:"Successfull to get data user",
            statusCode:200,
            results:response
        })
    }).catch(err =>{
        res.send({
            message:"Failed to get data user",
            statusCode:500
        })
    })
}
exports.UploadPicture = async(req,res)=>{
    let Token = await JWTModule.JWTVerify(req.headers)
    if (!Token){
        res.send({ message: `failed to get data, dont have access`, statusCode: 403 })
    }else if(!req.body || !req.files){
        res.send({
            message:"Please fill all the fields",
            statusCode:402
        })
    }else if(!req.files.image.mimetype.include("image")){
        res.send({
            message:"Invalid image type",
            statusCode:415
        })
    }else{
        let profilePicture = req.files.image;
        let newNameImage = RandomString(25) + profilePicture.mimetype.replace("image/",".");
        let dirName = Path.join(__dirname,"../public/images/"+newNameImage)
        let pathImage = "http://"+req.get("host")+"/images/"+newNameImage

        profilePicture.mv(dirName + newNameImage,async (err)=>{
            const image = new ImageModel({
                owner:Token.username,
                imageFile:pathImage
            })
            await image.save(image).then(  response=>{
                response =>{
                    let dataGet =  Usermodel.aggregate([
                        {
                            $match:{"username":token.username}
                        },{
                            $lookup:{from:'images',localField:'username',foreignField:'owner',as:'imagelist'}
                        }
                    ]).then(response => response).catch(err => false)
                    if(!dataGet) res.sendStatus(500)
                    else res.send({
                        message:'Successfull to get data',
                        statusCode:200,
                        results:dataGet
                    })
                }
            }).catch(err =>{
                res.send({
                    message:"Error Upload photo",
                    statusCode:400
                })
            })
            
        })
    }
    
    

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