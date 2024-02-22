const jwt = require("jsonwebtoken");
require("dotenv").config();

// middlware for authentication 
// token ko validate karna hai
exports.auth = (req,res,next) => {
    try{

        console.log("cookie " , req.cookies.token);
        console.log("body " , req.body.token);
        console.log("header ", req.header("Authorization"));


        // we can fetch the token in 3 ways - 
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        // token not available
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token missing :-("
            })
        }

        // verify the token
        try{
            // .verify() se saara ka saara token ka data "payload " me aajayega
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            // paylaod ko store kara liya
            req.user = payload;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }

        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"something went wrong , while verifying the token and cannot be authenticate:-("
        })
    }
}


// middleware for isStudent (authorization)
exports.isStudent = (req,res,next) =>{
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for student"
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role not verified"
        })
    }
}


// middleware for isAdmin (authorization)
exports.isAdmin = (req,res,next) =>{
    try{
        if(res.user.role != "Admin"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for admin"
            })
        }
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Admin role not verified"
        })
    }
}