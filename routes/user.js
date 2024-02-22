const express = require("express");
const router = express.Router();

const { login, signup } = require("../controllers/Auth");
const { auth, isStudent, isAdmin } = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);

// middlewares
// protected routes => jis ka jo role hai wo sirf whi route access kar skta hai , baaki log nhi kar payege
// student can't access the admin routes & vice versa

router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:"this is the testing route for middleware"
    })
})


router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"this is the protected route for student"
    })
})


router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"this is the protected route for admin"
    })
})

module.exports = router;
