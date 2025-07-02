const mongoose = require('mongoose');
require("dotenv").config();

async function connectDB(){
    try{
       await mongoose.connect(`${process.env.MONGODB_URL}/greencart`);
       console.log("mongodb connected successfully")
    }
    catch(error){
        console.log(error)
    }
}

module.exports = connectDB;