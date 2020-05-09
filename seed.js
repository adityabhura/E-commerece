var mangoose=require("mongoose");
var Product=require("./models/product.js");
var Comment=require("./models/comments.js");
var User=require("./models/user.js");
var Myorder=require("./models/myorders.js");
var request = require("request");

function seedDB(){
    Product.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("removed product");
        }
    })
    User.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("removed user");
        }
    })
    Myorder.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("removed my orders");
        }
    })
    Comment.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("removed all comments");
        }
    })
    removeContacts();
};

//function remove all contacts


function removeContacts(){
        var options = {
        method: 'POST',
        url: 'https://api.sendinblue.com/v3/contacts/lists/7/contacts/remove',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': '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'
        },
        body: '{"all":true}'
        };

        request(options, function (error, response, body) {
        if (error){
            console.log(error)
        }else{
            console.log("removed contacts just from the list remove the contacts from the contacts too")
        }
        });
}
module.exports=seedDB;