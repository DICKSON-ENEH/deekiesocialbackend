const jwt = require("jsonwebtoken")
const userModel = require("../Model/userModel")
const cloudinary = require("../utils/cloudinary")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const nodemailer = require("nodemailer")


const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
 user: " deetech196@gmail.com",
 pass:"deetech196@gmail.com/mkpoikana"
    }
})
const getUser = async(req, res)=>{
    try {
        const user = await userModel.find()
        res.status(200).json({
            message:"success",
            data:user
        })
    } catch (error) {
        console.log(error)
    }
}
const getOneUser = async(req, res)=>{
    try {
        const user = await userModel.findById(req.params.id)
        res.status(200).json({
            message:"success",
            data:user
        })
    } catch (error) {
        console.log(error)
    }
}

const updateUser = async(req, res)=>{
     try{
 const {fullName, userName}= req.body;
 const user= await userModel.findById(req.params.id)
 if(user){
 const image =    await cloudinary.uploader.upload(req.file.path)
     const user = await userModel.findByIdAndUpdate( req.params.id,{
    fullName,
    userName,
    avatar:image.secure_url,
    avatarID:image.public_id
     } , {new:true})

     res.status(200).json({
         message:"success",
         data:user
     })
 }
     }catch(error){
         console.log(error.message)
     }
}
const deleteUser = async(req, res)=>{
    try {
        const user = await userModel.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message:"success",
           
        })
    } catch (error) {
        console.log(error)
    }
}
const createUser = async(req, res)=>{
    try{
const {fullName, userName,email, password}= req.body
const salt = await bcrypt.genSalt(10)
const hashed = await bcrypt.hashed(password, salt)
const image = await cloudinary.uploader.upload(req.file.path)
const getToken = crypto.randomBytes(32).toString("hex")
const token = jwt.sign({getToken}, "thisisthesecret", {expiresIn:"30m"})
const user = await userModel.create({
    fullName,
    userName,
    email,
    password:hashed,
    avatar:image.secure_url,
    avatar:image.public_id,
})
const testURL = "http://localhost:3000"
const mainURL ="https://deekiesocialfrontend.herokuapp.com/"
const mailOptions={
    from :"no-reply@gmail.com",
    subject: "Account Verification",
    to:email,
    html:`<h2> thank you for joining us please use this <a href="${testURL}/api/token/${user_id}/${token}"> to continue</a> </h2>`
}
transport.sendMail(mailOptions,(err, info)=>{
    if (err) {
       console.log(err.msg) 
    } else {
     console.log("email has been sent", info.response)   
    }
})
res.status(201).json({
    status:"check your email ..."
})
    }catch(error){
        console.log(error)
    }
}
const verifiedUser= async(req, res)=>{
    try {
        const user = await userModel.findById(req.params.id)

        if(user){
            if(user.verifiedToken !== ""){
                await userModel.findByIdAndUpdate(req.params.id, {
                    isVerified:true,
                    verifiedToken:""
                }, {new:true})
            }
            res.status(200).json({
                status:"your account is active"
            })
        }else{
            res.status(404).json({
                status:"user unverified"
            })
        }
        res.status(404).json({
        status:"no user found"
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports= {
    createUser,
    updateUser,
    getOneUser,
    getUser,
    deleteUser,
    verifiedUser
}