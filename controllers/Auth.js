const bcrypt = require("bcrypt");
const User = require("../model/User");
const { json } = require("express");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// signup route handler
exports.signup = async (req,res) =>{
    try{
        // step 1 : get data or fetch the data from request body
        const {name ,email ,password ,role} = req.body;

        // step 2 : check if user already exist (agar user already exist kar rha hoga toh uska email database me pada hoga)
        const existingUser = await User.findOne({email});

        // existing user mil gaya / user registered hai
        if(existingUser){
            // 400 => not found
            return res.status(400).json({
                success:false,
                message:"User/Email already exits :-( ",
            });
        }

        // step 3 : securing or hashing the password (using bcrypt hash function)
        let hashedPassword;
        try{
            // here 10 means number of rounds
            hashedPassword = await bcrypt.hash(password,10);
        }
        // password hash nhi ho paaya
        catch(err){
            //  500 internal server error
            return res.status(500).json({
                success:false,
                message:"Password can't be hashed :-(",
            })
        }

        // step 4 : creating entry for user in the database
        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:"User account created successfully :-)"
        })

    }catch(error){
        // 500 => internal server error
        console.log(error);
        return res.status(500),json({
            success:false,
            message:"User cannot be registered , please try again later :-("
        })
    }
}

// login route handler
exports.login = async (req,res) =>{
    try{
        // step 1 : fetching the data(email and password) from request body
        const {email , password} = req.body;

        // step 2 : validate email and password
        if(!email || !password){
            // 400 => not found
            return res.status(400).json({
                success:false,
                message:"OOPS , No record found for email and password :-("
            })
        }

        // step 3 : check for existing or registered user (email , existing user ki mail id Data base mai padi hogi)
        let user = await User.findOne({email}); // user ke object me ye sab hoga = {name ,password , email , role , id}
        
        // if user not exists or registered
        if(!user){
            // 401 means unauthorized
            return res.status(401).json({
                success:false,
                message:"user is not registered :-("
            })
        }

        // step 4 :  verify password(using bcrypt compare function) and if => generate JWT token
    
        // creating payload or data which we want to insert in the token
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role // role is used for authorization
        }
        // password matched
        if(await bcrypt.compare(password , user.password)){
            // password matched => login karwana hai , 
            // we need to create an JWT token using sign(payload/data , secret key , expiry/options) method
            let token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn:"2h"});

            // user (jo find kiya tha) uski anadar ek field (token) bana kar token usme pass kar diya
            user = user.toObject();
            user.token = token; 

            // jo bhi user ka object aayega us mese password remove kar denge for security purpose
            user.password = undefined;
            // user:{id,email,role,password:undefined,token}


            // response me cookie send ka rhe hai jisme token hoga
            // cookie(cookieName , data , options)
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000), // abhi se le kar 3 din tak ki expiry hai
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"user logged in sucessfully :-)"
            });
            
        }
        // password do not match , password is incorrect
        else{
            // 403 => Forbidden
            return res.status(403).json({
                success:false,
                message:"password do not match , incorrect password",
            })
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
        success:false,
        message:"login failed :-("
    })
    }
}