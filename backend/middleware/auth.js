import JWT from "jsonwebtoken"; 
import userModel from "../models/userModel.js"; 

// Middleware to verify user authentication
const authMiddleware = async (req, res, next) => { 
    try {
        // Extracting the authorization header
        const authHeader = req.headers.authorization; 

        // Checking for missing header or incorrect "Bearer" prefix
        if (!authHeader || !authHeader.startsWith("Bearer ")) { 
            return res.status(401).json({ 
                success: false, 
                message: "Not authorized or token missing" 
            }); 
        }

        // Splitting the header to extract the actual token
        const token = authHeader.split(" ")[4]; 

        // Verifying the token with the secret key
        const payload = JWT.verify(token, process.env.JWT_SECRET); 

        // Finding the user associated with the token, excluding the password
        const user = await userModel.findById(payload.id).select("-password"); 

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "User not found" 
            }); 
        }

        // Attaching the user object to the request for use in downstream routes
        req.user = user; 
        next(); 

    } catch (error) {
        console.error("JWT verification failed", error); 
        return res.status(401).json({ 
            success: false, 
            message: "Token invalid or expired" 
        }); 
    }
};

export default authMiddleware; 
