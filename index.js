// importing express
const express = require('express');
// creating instance of express
const app = express();

// loading the .env file data into the process object
require('dotenv').config();
const PORT = process.env.PORT || 4000;


// cookie parser
const cookieParsar = require("cookie-parser");
app.use(cookieParsar());


// middleware for parsing
app.use(express.json());

// importing all the routes and mounting
const user = require("./routes/user");
app.use("/api/v1",user);

// connecting to database
const dbConnect = require('./config/database');
dbConnect();

// listen to port
app.listen(PORT,()=>{
    console.log(`server is sucessfully running at port ${PORT}`);
})


