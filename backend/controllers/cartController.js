import cartModel from "../models/cartModel.js"; 
import book from "../models/bookModel.js"; 

// Add or increment item in the cart
export const addToCart = async (req, res) => {
    try {
        const { bookId, quantity } = req.body; 

        if (!bookId || quantity < 1) {
            return res.status(400).json({ success: false, message: "book ID and valid quantity is required" });
        }

        // Verify book exists
        const foundBook = await book.findById(bookId); 
        if (!foundBook) {
            return res.status(404).json({ success: false, message: "book not found" }); 
        }

        let cart = await cartModel.findOne({ user: req.user.id }); 

        if (!cart) {
            // Create new cart if none exists
            cart = await cartModel.create({
                user: req.user.id, 
                items: [{ book: bookId, quantity }] 
            });
        } else {
            // Update existing cart
            const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity; 
            } else {
                cart.items.push({ book: bookId, quantity }); 
            }
        }

        await cart.save(); 
        res.status(200).json({ success: true, message: "item added to cart", cart }); 
    } catch (error) {
        res.status(500).json({ success: false, message: "error adding to cart", error: error.message }); 
    }
};

// Retrieve cart with calculated totals
export const getCart = async (req, res) => {
    try {
        const cart = await cartModel.findOne({ user: req.user.id }).populate('items.book'); 

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({
                success: true,
                cart: { items: [], totalAmount: 0, tax: 0, shipping: 0, finalAmount: 0 } 
            });
        }

        let totalAmount = 0;
        const taxRate = 0.1; // 10% tax 
        const shipping = 50; // Flat shipping fee 

        cart.items.forEach(item => {
            totalAmount += (item.book.price || 0) * item.quantity; 
        });

        const tax = parseFloat((totalAmount * taxRate).toFixed(2)); 
        const finalAmount = parseFloat((totalAmount + tax + shipping).toFixed(2)); 

        res.status(200).json({
            success: true,
            cart,
            summary: { totalAmount, tax, shipping, finalAmount } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "error in retrieving cart" }); 
    }
};

// Update item quantity directly
export const updateCartItem = async (req, res) => {
    try {
        const { bookId, quantity } = req.body; 
        const cart = await cartModel.findOne({ user: req.user.id }); 

        const item = cart.items.find(item => item.book.toString() === bookId); 
        if (!item) {
            return res.status(404).json({ success: false, message: "item not found" }); 
        }

        item.quantity = quantity; 
        await cart.save(); 
        res.status(200).json({ success: true, message: "cart updated", cart }); 
    } catch (error) {
        res.status(500).json({ success: false, message: "error updating cart items" }); 
    }
};

// Remove a specific item
export const removeCartItem = async (req, res) => {
    try {
        const { id } = req.params; // Book ID 
        const cart = await cartModel.findOne({ user: req.user.id }); 

        cart.items = cart.items.filter(item => item.book.toString() !== id); 
        await cart.save(); // [13]
        res.status(200).json({ success: true, message: "item removed from cart", cart }); 
    } catch (error) {
        res.status(500).json({ success: false, message: "removing cart item failed" }); 
    }
};

// Clear the entire cart (used after successful checkout)
export const clearUserCart = async (req, res) => {
    try {
        const cart = await cartModel.findOne({ user: req.user.id }); 
        if (!cart) return res.status(404).json({ success: false, message: "cart not found" }); 

        cart.items = []; // Empty the items array 
        await cart.save(); // 
        res.status(200).json({ success: true, message: "cart cleared" }); // 
    } catch (error) {
        res.status(500).json({ success: false, message: "server error clearing cart" }); // 
    }
};