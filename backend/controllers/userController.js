import userModel from "../models/userModel";
import validator from 'validator'
import bcrypt from 'bcryptjs'


//REGISTER FUNCTION
export async function registerUser(req,res){
    const {username, email, password} = req.body;
    
    if (!username || !email || !password){
        return res.status(400).json({success: false, message: "All fields are required"})
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({
            success: false,
            message: 'Invalid email'
        })
    }

    if(password.length < 8){
        return res.status(400).json({
            success: false,
            message: 'Password must be atleast 8 characters.'
        })
    }

    try{
        const userExist = await userModel.findOne({email})
    }

    catch(error){
        
    }

}