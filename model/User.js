// importing mongoose
const mongoose = require("mongoose");

// creating user schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        require:true,
    },
    role:{
        type:String,
        // role sirf in 3 value mese hoga 
        enum:["Admin","Student","Visitor"]
    }
})

// exporting the schema
module.exports = mongoose.model("user",userSchema);