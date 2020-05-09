var mongoose=require("mongoose");

var myorderSchema=new mongoose.Schema({
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        author:{
            id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
            }
        },
        username:String,
        quantity:Number,
        amount:Number,
        status:Boolean,
        address:String,
        track:[{
            details:String,
            updated:{type:Date,default:Date.now}
        }
        ],
        updated:{type:Date,default:Date.now}
})

module.exports=mongoose.model("Myorder",myorderSchema)

