const Mongoose = require('mongoose');


const Schema = new Mongoose.Schema({
    nameProduct:{type:String},
    price:{type:Number},
    quantity:{type:Number},
    ownerProduct:{type:String},
    description:{type:String},
    rating:{type:Number},
    
})

Schema.method("toJSON",function(){
    const{__v,_id,...object} = this.toObject();
    object.id = _id
    return object
})

const schemaGame = Mongoose.model("Games",Schema)
module.exports = schemaGame;
