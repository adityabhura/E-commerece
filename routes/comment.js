var express=require("express");
var router=express.Router();
var Product=require("../models/product.js");
var Comment=require("../models/comments.js");
var request=require("request");
var User=require("../models/user.js")

//new comment form
router.get("/products/:id/comment/new",isLoggedIn,function(req,res){
    Product.findById(req.params.id,function(err,product){
        if(err){
            console.log(err);
        }else{
           res.render("newcomment",{product:product});
        }
    })
})

router.post("/products/:id/comment",isLoggedIn,function(req,res){
   Product.findById(req.params.id,function(err,product){
       if(err){
        req.flash("error","Something went wrong");
           console.log(err);
       }else{
           Comment.create(req.body.comment,function(err,comment){
               if(err){
                   console.log(err);
               }else{
                   comment.author.id=req.user._id;
                   comment.author.username=req.user.username;
                   comment.save();
                   product.comments.push(comment);
                   product.save();
                   sendEmailToSellerAboutNewComment(req.user.username,product.title,product.author.id);
                   req.flash("success","Added your Comment About the Product");
                   res.redirect("/products/" + req.params.id);
               }
           })
       }
   })
})

//edit comment form
router.get("/products/:id/comment/:commentId/edit",checkUserComments,function(req,res){
    var productId=req.params.id;
    Comment.findById(req.params.commentId,function(err,comment){
        if(err){
            res.redirect("back");
        }else{
            res.render("editComment",{productId:productId,comment:comment});
        }
    })
})

//editing comment route
router.put("/products/:id/comment/:commentId",checkUserComments,function(req,res){
    Comment.findByIdAndUpdate(req.params.commentId,req.body.comment,function(err,comment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Successfully Edited your comment");
            res.redirect("/products/" + req.params.id );
        }
    })
})

router.delete("/products/:id/comment/:commentId",checkUserComments,function(req,res){
    Comment.findByIdAndDelete(req.params.commentId,function(err){
            req.flash("success","Successfully deleted your comment");
            res.redirect("/products/" + req.params.id)      
    })
})

 //if logged in function
 function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
        req.flash("error","You need to be logged in");
        res.redirect("/login");   
}

//check user logged in
function checkUserComments(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,function(err,foundComment){
            if(err){
                console.log(err);
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You are not allowed to do that");
                    res.redirect("back");
                }
            }
        })
    }
}

function sendEmailToSellerAboutNewComment(username,productName,productAuthorId){
    //updating the email campaign
    var emailBody=username + " has added a new comment to your product " + productName; 
    var options = {
        method: 'PUT',
        url: 'https://api.sendinblue.com/v3/emailCampaigns/4',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': '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'
        },
        body: '{"recipients":{"listIds":[7]},"inlineImageActivation":false,"recurring":false,"abTesting":false,"ipWarmupEnable":false,"htmlContent":"<Strong>'+emailBody+'</strong>","subject":"New comment on your Product"}'
        };
    
        request(options, function (error, response, body) {
            if (error){
                console.log(error)
            }
              console.log(body);
              console.log("updated Campaign")
          });
          //sending email
          User.findById(productAuthorId,function(err,user){
            var options = {
                method: 'POST',
                url: 'https://api.sendinblue.com/v3/emailCampaigns/4/sendTest',
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                  'api-key': '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'
                },
                body: '{"emailTo":["'+user.email+'"]}'
              };
              
              request(options, function (error, response, body) {
                if (error){
                    console.log(error +"is the error")
                }else{
                    console.log("email sent")
                }
              });
          })
}

module.exports=router;