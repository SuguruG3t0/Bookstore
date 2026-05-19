import userModel from '../models/userModel'; 
import validator from "validator"; 
import brypt from "bcrypt"; 
import JWT from "jsonwebtoken"; 

// Helper function to create a JWT token 
const createToken = (id) => {
    return JWT.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '24h' // Token expires in 24 hours 
    });
};

// Route for User Registration [1]
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body; 

        // Validating all fields are present 
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Validating email format 
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        // Validating password length 
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Checking if user already exists 
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Hashing the password 
        const salt = 10;
        const hashedPassword = await brypt.hash(password, salt);

        // Creating new user 
        const user = await userModel.create({
            name: username,
            email,
            password: hashedPassword
        });

        // Generating token and sending response 
        const token = createToken(user._id);
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                username: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration error", error);
        res.status(500).json({ success: false, message: "Server error" }); // 
    }
};

// Route for User Login 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // 

        // Checking for missing fields 
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Finding user by email 
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "User does not exist" });
        }

        // Comparing passwords 
        const isMatch = await brypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generating token and sending response 
        const token = createToken(user._id);
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ success: false, message: "Server error" }); // [9]
    }
};
