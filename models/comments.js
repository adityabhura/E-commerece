var mongoose=require("mongoose");

//Defining the Schema
var commentSchema = new mongoose.Schema({
    title:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
           ref:"User"
        },
        username:String
    },
    date:{type:Date,default:Date.now}
});

//Making the model so that the DB is made
module.exports=mongoose.model("Comment",commentSchema);