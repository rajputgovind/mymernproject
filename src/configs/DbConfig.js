// import mongoose from "mongoose";
const mongoose = require("mongoose")


 async function dbConnenction(){
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("database connect successfully")
    } catch (error) {
        console.log("error in connecting database.")   
    }

}

module.exports = dbConnenction