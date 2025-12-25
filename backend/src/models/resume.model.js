const mongoose = require("mongoose")


const resumeSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "users",
        required:true,
        unique: true
    },
    content:{
        type:String,
        required:true
    },
    filename:{
        type:String
    }

},{timestamps:true})


const resumeModel=mongoose.model("resumes",resumeSchema)


module.exports=resumeModel