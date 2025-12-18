const app =require("./src/app")
require("dotenv").config()
const connectDB=require("./src/db/db")

connectDB()

app.listen(3000,()=>{
    console.log("server running on port 3000")
})