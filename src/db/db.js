const mongoose=require("mongoose")



async function connectDB(){

    try{
        await mongoose.connect(process.env.MONGOdb_URL)
        console.log("connected to DB")
    }catch(err){

        console.log("Error while connecting to MongoDb:",err)
    }



}


module.exports=connectDB