const Mongoose = require('mongoose')

const Schema = new Mongoose.Schema({
    product_id:{type:String},
    user:{type:String},
    total_price:{type:String},
    isAccepted:{type:Boolean}
})

Schema.method("toJSON",function(){
    const{__v,_id,...object} = this.toObject();
    object.id = _id
    return object
})
const schemaTransaction = Mongoose.model("Transaction",Schema)
module.exports = schemaTransaction;