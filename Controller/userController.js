const jwt = require("jsonwebtoken")
const userModel = require("../Model/userModel")
const cloudinary = require("../utils/cloudinary")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const nodemailer = require("nodemailer")


const transport = nodemailer.createTransport({
    service:"hotmail",
    auth:{
 user: "preciousonuegbu23@hotmail.com",
 pass:"Top12345"
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
const hashed = await bcrypt.hash(password, salt)
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
    from :"preciousonuegbu23@hotmail.com",
    subject: "Account Verification",
    to:email,
    html:`<h2> thank you for joining us please use this <a href="${testURL}/api/token/${user._id}/${token}"> to continue</a> </h2>`
}
transport.sendMail(mailOptions,(err, info)=>{
    if (err) {
       console.log(err) 
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

const signinUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await userModel.findOne({ email });
		if (user) {
			const check = await bcrypt.compare(password, user.password);

			if (check) {
				if (user.isVerified && user.verifiedToken === "") {
					const token = jwt.sign(
						{
							_id: user._id,
							isVerified: user.isVerified,
						},
						"thisisthesecret",
						{ expiresIn: "2d" }
					);

					const { password, ...info } = user._doc;

					res.status(201).json({
						message: `welcome ${user.fullName}`,
						data: { token, ...info },
					});
				} else {
					const getToken = crypto.randomBytes(32).toString("hex");
					const token = jwt.sign({ getToken }, "thisisthesecret", {
						expiresIn: "20m",
					});

					const testURL = "http://localhost:3000";
					const mainURL = "https://deekiesocialfrontend.herokuapp.com/";

					const mailOptions = {
						from: "preciousonuegbu23@hotmail.com",
						to: email,
						subject: "Account Verification",
						html: `<h2>
            This is to verify your account, Please use this <a
            href="${testURL}/api/user/token/${user._id}/${token}"
            >Link to Continue</a>
            </h2>`,
					};

					transport.sendMail(mailOptions, (err, info) => {
						if (err) {
							console.log(err.message);
						} else {
							console.log("Mail sent: ", info.response);
						}
					});

					res.status(201).json({ message: "Check you email...!" });
				}
			} else {
				res.status(404).json({ message: "password is incorrect" });
			}
		} else {
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
const forgetPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await userModel.findOne({ email });

		if (user) {
			if (user.isVerified && user.verifiedToken === "") {
				const getToken = crypto.randomBytes(32).toString("hex");
				const token = jwt.sign({ getToken }, "thisisthesecret", {
					expiresIn: "10m",
				});

				const testURL = "http://localhost:3000";
				const mainURL = "https://deekiesocialfrontend.herokuapp.com/";

				const mailOptions = {
					from: "preciousonuegbu23@hotmail.com",
					to: email,
					subject: "Reset Password Request",
					html: `<h2>
            This is a Reset Password Request for your account, Please use this <a
            href="${testURL}/api/user/token/${user._id}/${token}"
            >Link to complete the process</a>
            </h2>`,
				};

				transport.sendMail(mailOptions, (err, info) => {
					if (err) {
						console.log(err.message);
					} else {
						console.log("Mail sent: ", info.response);
					}
				});

				res.status(201).json({ message: "Check you email...!" });
			} else {
				res.status(404).json({ message: "cannot perform this Operation" });
			}
		} else {
			res.status(404).json({ message: "cannot find Email" });
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const resetPassword = async (req, res) => {
	try {
		const { password } = req.body;
		const user = await userModel.findById(req.params.id);

		if (user) {
			const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(password, salt);

			await userModel.findByIdAndUpdate(
				user._id,
				{
					password: hashed,
				},
				{ new: true }
			);

			res.status(201).json({ message: "password reset, you can now sign-in" });
		} else {
			res.status(404).json({ message: "error loading user" });
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
module.exports= {
    createUser,
    updateUser,
    getOneUser,
    getUser,
    deleteUser,
    verifiedUser,
    signinUser,
    resetPassword,
    forgetPassword
}