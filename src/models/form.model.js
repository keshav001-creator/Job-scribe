const mongoose = require("mongoose")


const formSchema = new mongoose.Schema({

    userId:{
        type:String,
        required:true
    },

    company:{
        type:String,
        required:true,
        unique:true
    },

    JobDescription: {
        type:String,
        required:true,
    },

    role:{
        type:String,
        require:true
    },

    status:{
        type:String,
        enum:["applied","interview","rejected"]
    },
    appliedDate:{
        type:Number,
        require:true
    }

})


const formModel=mongoose.model("form",formSchema)


module.exports=formModel