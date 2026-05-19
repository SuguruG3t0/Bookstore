import express from "express";
import authMiddleware from "../middleware/auth.js"; // Referred to as o middleware 
import { 
    addToCart, 
    getCart, 
    updateCartItem, 
    removeCartItem, 
    clearUserCart 
} from "../controllers/cartController.js"; 

const cartRouter = express.Router(); 

// All cart routes are protected and require a valid token
cartRouter.post("/add", authMiddleware, addToCart); // Adds or increments items 
cartRouter.get("/", authMiddleware, getCart); // Fetches cart with calculated totals 
cartRouter.put("/update", authMiddleware, updateCartItem); // Updates specific item quantities
cartRouter.delete("/remove/:id", authMiddleware, removeCartItem); // Removes a single item by book ID 
cartRouter.delete("/clear", authMiddleware, clearUserCart); // Empties the cart after checkout

export default cartRouter;