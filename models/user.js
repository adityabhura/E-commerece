var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var UserSchema=new mongoose.Schema({
    username:String,
    password:String,
    email:{type:String,unique:true},
    phoneNumber:{type:Number,unique:true},
    token:String,
    active:Boolean,
    myorders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Myorder"
    }],
    myproducts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }],
    ordered:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Myorder"
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",UserSchema);