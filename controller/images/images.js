const ImagePost = require('../../model/mongodb/Images/Images')
const uploadFile = require('../../module/uploadfile')


exports.PostImage = async(req,res)=>{
    try{
        await uploadFile(req,res);
        if(req.file == undefined){
            res.send({
                message:"Please upload a file",
                statusCode:400
            })
        }
        let imageData = new ImagePost.create({
            owner:req.name,
            image:req.file
        })
        await imageData.save().then(response=>{
            res.send({
                message:"Uploaded the file successfully" + req.file,
                statusCode:200,
                result:response
            })
        })
        
        
    }catch(err){
        res.send({
            message:"Could not upload file" + req.file,
            statusCode:500
        })
    }
}

exports.getImageList = (req,res)=>{
    const directoryPath = __dirname + "public/images"
    fs.readdir(directoryPath,function(err,files){
        if(err){
            res.send({
                message:"Unable to scan files!",
                statusCode:500
            })
        }
        let fileInfos = [];
        files.forEach((file)=>{
            fileInfos.push({
                
            })
        })
    })
}