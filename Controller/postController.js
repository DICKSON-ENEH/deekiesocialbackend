const userModel = require("../model/userModel")
const postModel= require("../model/postModel")
const cloudinary = require("../model/cloudinary")
const mongoose = require("mongoose")


const createPost = async (req, res) => {
    try{
const {message }= req.body
const image =    await cloudinary.uploader.upload(req.file.path)
const getUser = await userModel.findById(req.params.id)
const postData = await new postModel({
    message,
    avatar:image.secure_url,
    avatar:image.public_id
})

postData.user=getUser
postData.save()

    }catch(error){
        console.log(error)
    }
}

const viewpost = async (req, res) => {
    try {
        const getall = await postModel.find()
        res.status(200).json({ message:"success",
        data:getall
    })
    } catch (error) {
        console.log(error.message)
    }
}
const deleted = async(req, res)=>{
  try {
      const postData = await userModel.findById(req.params.id)
      const remove =await postModel.caller

  } catch (error) {
      console.log(error)
  }  
}

module.exports ={
    viewpost,
    createPost
}