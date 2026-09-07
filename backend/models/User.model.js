import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:{
        type:String,
    },
    userNmae:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:String,
        default:"https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
    }
  },
  { timestamps: true },
);


const User=mongoose.model("User",userSchema);
export default User;