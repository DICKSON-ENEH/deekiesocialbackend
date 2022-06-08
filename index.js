const express = require("express")
const cors = require("cors")
const port = process.env.PORT || 1234
const app = express()
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://socialapp:today@cluster0.xd5wm.mongodb.net/socialapp?").then(()=>{
    console.log("connected")
}).catch((error)=>{
    console.log(error.message)
})
app.use(cors())
app.use(express.json())
app.get("/", (req, res)=>{
    res.status(200).json({
        message:"success"
        })
})
app.use("/api/user")
app.listen(port,()=>{
    console.log("connected", port)
})