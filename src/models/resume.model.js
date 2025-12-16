const mongoose = require("mongoose")


const resumeSchema = new mongoose.Schema({

    userId:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Number,
        required:true
    }
    

})


const resumeModel=mongoose.model("resumes",resumeSchema)


module.exports=resumeModel