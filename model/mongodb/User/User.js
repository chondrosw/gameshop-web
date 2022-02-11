const Mongoose = require('mongoose')

var Schema = new Mongoose.Schema({
    username:{type:String},
    password:{type:String},
    fullname:{type:String},
    email:{type:String},
    money:{type:Number},
    type:{type:String},
    favorite:{type:String},
    photo:{type:String}
})

Schema.method("toJSON",function(){
    const{__v,_id,...object} = this.toObject();
    object.id = _id
    return object
})
var schemaUser = Mongoose.model('User',Schema);
module.exports = schemaUser