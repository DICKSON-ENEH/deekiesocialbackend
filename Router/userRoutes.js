const express = require("express")

const router =  express.Router()
const upload = require("../utils/multer")
const {  createUser,
    updateUser,
    getOneUser,
    getUser,
    resetPassword,
	forgetPassword,
    verifiedUser,
    deleteUser} = require("../Controller/userController")

    router.route("/").get(getUser)
    router.route("/token/:id/:token").get(verifiedUser)
    router.route("/register").post(upload, createUser)
    router.route("/:id").get(getOneUser).patch(upload, updateUser).delete(deleteUser)
    router.route("/reset/:id/:token").patch(resetPassword);
    router.route("/resetPassword").post(forgetPassword);

    module.exports = router   