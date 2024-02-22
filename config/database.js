// importing mongoose
const mongoose = require('mongoose');

// loading the .env file data in the process object
require('dotenv').config();

const dbConnect = () =>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>{
        console.log("database and server connected successfully :-)");
    })
    .catch((err)=>{
        console.log("error while connecting server and database :-(");
        console.error(err);
        process.exit(1);
        // it means the process is ended up with some failure
    })
}

// export the function
module.exports = dbConnect;