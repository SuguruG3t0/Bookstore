import express from "express"; 
import multer from "multer"; 
import { createBook, getBooks, deleteBook } from "../controllers/bookController.js"; 

const bookRouter = express.Router(); 

// Multer storage configuration for book images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Saves images to the uploads folder 
    },
    filename: (req, file, cb) => {
        // Generates a unique filename using the current timestamp 
        cb(null, `${Date.now()}-${file.originalname}`); 
    }
});

const upload = multer({ storage }); 

// Route to create a new book with an image upload
bookRouter.post("/", upload.single('image'), createBook); 

// Route to fetch all books
bookRouter.get("/", getBooks); 

// Route to delete a specific book by ID
bookRouter.delete("/:id", deleteBook); 

export default bookRouter; 
