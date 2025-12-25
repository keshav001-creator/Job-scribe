const app =require("./src/app")
require("dotenv").config()
const connectDB=require("./src/db/db")

connectDB()

const PORT=process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log("server running on port 3000")
})