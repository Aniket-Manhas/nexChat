import mongoose from "mongoose";

const connectDb=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo db connected");
    } catch (error) {
        console.log("Mongo db connection failed");
        console.log("MONGO_URI:", process.env.MONGO_URI);

        console.log(error);
    }
}

export default connectDb;