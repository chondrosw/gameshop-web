const Games = require('../../model/mongodb/Game/Game')
const JWTModule = require('../../module/checkAuth')
const Usermodel = require('../../model/mongodb/User/User')
const Path = require('path')
const RandomString = require('../../module/randomstring')
const { response } = require('express')

exports.GetAllGames = async(req,res)=>{
    let Token = await JWTModule.JWTVerify(req.headers)
    if (!Token) res.send({ message: `failed to get data, dont have access`, statusCode: 403 })
    Games.find().then(response=>{
        res.send({
            message:"Successfull to get data games",
            statusCode:200,
            results:response
        });
    }).catch(err=>{
        res.send({
            message:"Failed to get data",
            statusCode:500
        })
    })
    
}
exports.SearchGame = async(req,res)=>{
    await Games.find({"nameProduct":{$regex:`.*${req.query.search}`}}).then(response =>{
        res.send({
            message:'Successfull to search data',
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
exports.AddGameByDeveloper = async(req,res)=>{
    
    let {ownerProduct,nameProduct,price,rating,description} = req.body
    let token = await JWTModule.JWTVerify(req.headers)
    if(!token) res.send({
        message:'Failed to get data,dont have access',
        statusCode:403
    })
    if(!req.body){
        res.send(400)
    }
    const dataFind = await Games.findOne({'nameProduct':nameProduct})
    const newGames = new Games({
        nameProduct:nameProduct,
        ownerProduct:ownerProduct,
        price:price,
        rating:rating,
        description:description
    })
    console.log(dataFind)
    if(dataFind){
        res.send({
            message:"Already Exist",
            statusCode:500
        })
    }else{
        newGames.save(newGames).then(response=>{
            res.send({
                message:"Success save game",
                statusCode:200,
                results:response
            })
        }).catch(err=>{
            res.send({
                message:"Failed save game",
                statusCode:500
            })
        })
    }

}
exports.findGameByDeveloper = async(req,res)=>{
    let token = await JWTModule.JWTVerify(req.headers)
    if(!token) res.send({
        message:'Failed to get data,dont have access',
        statusCode:403
    })
    let dataGet = await Usermodel.aggregate([
        {
            $match:{"username":token.username}
        },{
            $lookup:{from:'games',localField:'username',foreignField:'ownerProduct',as:'games'}
        }
    ]).then(response => response).catch(err => false)
    if(!dataGet) res.sendStatus(500)
    else res.send({
        message:'Successfull to get data',
        statusCode:200,
        results:dataGet
    })

}
exports.GetGamesFavorite = async(req,res)=>{}
exports.UpdateGame = async(req,res)=>{
    let token = await JWTModule.JWTVerify(req.headers)
    if(!token) res.send({
        message:'Failed to get data,dont have access',
        statusCode:403
    })
    const id = req.params.id
    await Games.findByIdAndUpdate(id,req.body).then(response=>{
        if(response == null){
            res.send({
                message:"Data tidak ditemukan",
                statusCode:500
            })
        }
        res.send({
            message:'Success Update data game',
            statusCode:200,
            results:response
        })
    }).catch(err =>{
        res.send({
            message:"Failed update game data",
            statusCode:500
        })
    })
}
exports.DeleteGame = async(req,res)=>{
    let token = await JWTModule.JWTVerify(req.headers)
    if(!token) res.send({
        message:'Failed to get data,dont have access',
        statusCode:403
    })
    const id = req.params.id
    await Games.findOneAndDelete(id,req.body).then(response=>{
        if(response == null){
            res.send({
                message:"Data tidak ditemukan",
                statusCode:500
            })
        }
        res.send({
            message:'Success delete data game',
            statusCode:200,
            results:response
        })
    }).catch(err =>{
        res.send({
            message:"Failed delete game data",
            statusCode:500
        })
    })
}
