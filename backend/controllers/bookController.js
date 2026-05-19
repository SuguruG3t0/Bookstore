import book from "../models/bookModel.js"; // [1]
import path from "path"; // [3]
import fs from "fs"; // [3]

// Function to create a new book entry
export const createBook = async (req, res, next) => {
    try {
        // Handling the image file name and path from the request [1]
        const fileName = req.file ? req.file.filename : null;
        const imagePath = fileName ? `/uploads/${fileName}` : null;

        // Extracting book details from request body [1]
        const { title, author, price, rating, category, description } = req.body;

        // Creating and saving the new book to MongoDB [4]
        const newBook = new book({
            title,
            author,
            price,
            rating,
            category,
            description,
            image: imagePath
        });

        const saved = await newBook.save();
        res.status(201).json(saved); // [4]

    } catch (error) {
        next(error); // [4]
    }
};

// Function to fetch all books from the database
export const getBooks = async (req, res, next) => {
    try {
        // Finding all books and sorting by the latest entries first [2]
        const books = await book.find().sort({ createdAt: -1 });
        res.status(200).json(books); // [2]
    } catch (error) {
        next(error); // [2]
    }
};

// Function to delete a book and its associated image
export const deleteBook = async (req, res, next) => {
    try {
        // Finding the book by ID and deleting it from the database [2]
        const deletedBook = await book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({ message: "book not found" }); // [5]
        }

        // Image handler: removing the image from the uploads folder if it exists [5]
        if (deletedBook.image) {
            const filePath = path.join(process.cwd(), deletedBook.image);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.warn("failed to delete the image", err); // [5]
                }
            });
        }

        res.status(200).json({ message: "book deleted successfully" }); // [6]

    } catch (error) {
        next(error); // [7]
    }
};