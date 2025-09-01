import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const DB_URL = process.env.DB_URL;
export const  CreateConnection = async()=>{
    try {
        const connect = await mongoose.connect(DB_URL);
        console.log("connection successfull");
        return connect;
    } catch (error) {
        console.log("error connecting to the database!", error);
        throw error;   
    }

}