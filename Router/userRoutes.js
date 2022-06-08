const express = require("express")

const router =  express.Router()
const {upload} = require("../utils/multer")
const {  createUser,
    updateUser,
    getOneUser,
    getUser,
    verifiedUser,
    deleteUser} = require("../Controller/userController")

    router.route("/").get(getUser)
    router.route("token/:id/:token").get(verifiedUser)
    router.route("/register").post(upload, createUser)
    router.route("/:id").get(getOneUser).patch(updateUser).delete(deleteUser)