const mongoose = require("mongoose")


const resumeSchema = new mongoose.Schema({

    userId:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }

},{timestamps:true})


const resumeModel=mongoose.model("resumes",resumeSchema)


module.exports=resumeModel