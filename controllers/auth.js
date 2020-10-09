const User = require("../models/user");
const {validationResult} = require("express-validator");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


exports.signup = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            parameter: errors.array()[0].param
        });
    }
    
    const user = new User(req.body);
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err: "Unable to save user into DB"
            })
        }
        return res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
};

exports.signin = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            parameter: errors.array()[0].param
        });
    }

    const {email, password} = req.body;

    User.findOne({email}, (err, user) => {
        if(err ){
            return res.status(400).json({
                error: "Error lookng for the user.."
            })
        }
        if(!user){
            return res.status(400).json({
                error: "User email doesn't exist!"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Username or Password do not match..!"
            })
        }
        // create token
        const token = jwt.sign({_id:user._id}, process.env.SECRET);
         
        //put token in cookie
        res.cookie("token",token, {expire: new Date()+9999});

        //send responde to frontend

        const {_id, name, email, role} = user;
        res.json({
            token,
            user:{
                _id,
                name,
                email,
                role
            }
        }); 

    });
};

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User Logout..!"
    });
};


//protected routes

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

//custom middlewares

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id

    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED.."
        });
    }
    next();

};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "You're not authenticated to accces this route.."
        });
    }
    next();
};

