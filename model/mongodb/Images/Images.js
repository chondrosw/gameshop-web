const Mongoose = require('mongoose');


const Schema = new Mongoose.Schema({
    nameProduct:{type:String},
    image:{type:String}
    
})

Schema.method("toJSON",function(){
    const{__v,_id,...object} = this.toObject();
    object.id = _id
    return object
})

const schemaImages = Mongoose.model("Images",Schema)
module.exports = schemaImages;
