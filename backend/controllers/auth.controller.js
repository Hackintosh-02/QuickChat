import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signupUser = async(req, res)=>{
    try {
        const {fullName, username, password, confirmPassword,gender} = req.body;
    
        if(password != confirmPassword){
            return res.status(400).json({error: "Password Don't match"});
        }

        const user = await User.findOne({username});

        if(user){
            return res.status(400).json({error: "Username already exists"});
        }

        //Hash password here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //https://avatar.iran.liara.run/public/boy?username=Scott

        const boyProfilePic =  `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        if(newUser){
            //Generate JWT token here
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        })
        }
        else{
            res.status(400).json({error: "Invalid user data"});
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
};

export const loginUser = async (req, res) => {
    try {
        // Handle user login logic here
        res.status(200).send("User logged in");
    } catch (error) {
        res.status(500).send("Error logging in user");
    }
};

export const logoutUser = async (req, res) => {
    try {
        // Handle user logout logic here
        res.status(200).send("User logged out");
    } catch (error) {
        res.status(500).send("Error logging out user");
    }
};
