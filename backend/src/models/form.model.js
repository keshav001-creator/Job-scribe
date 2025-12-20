const mongoose = require("mongoose")


const formSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId, // store ObjectId of the User
        ref: "user",
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
        required:true
    },

    status:{
        type:String,
        enum:["Applied","Interview","Rejected"],
        default:"applied"
    },
    appliedDate:{
        type:Date,
        required:true
    }

})


const formModel=mongoose.model("form",formSchema)


module.exports=formModel