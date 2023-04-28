import mongoose from "mongoose";

const connectMongo = async ()=>mongoose.connect(process.env.MONGO_URI);

module.exports =  connectMongo;