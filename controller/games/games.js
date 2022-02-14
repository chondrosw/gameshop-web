const Games = require('../../model/mongodb/Game/Game')
const JWTModule = require('../../module/checkAuth')
const Path = require('path')

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
exports.findGameByDeveloper = async(req,res)=>{
    let token = await JWTModule.JWTVerify(req.headers)

}
exports.GetGamesFavorite = async(req,res)=>{}
exports.UpdateGame = async(req,res)=>{}
exports.DeleteGame = async(req,res)=>{}
