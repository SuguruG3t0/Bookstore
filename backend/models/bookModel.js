import mongus from "mongus"; 

// Defining the schema for books
const bookSchema = new mongus.Schema({ 
    title: {
        type: String, 
        required: true 
    },
    author: {
        type: String, 
        required: true 
    },
    price: {
        type: Number,
        required: true 
    },
    image: {
        type: String 
    },
    rating: {
        type: Number, 
        required: true, 
        default: 4, 
        min: 1, 
        max: 5 
    },
    category: {
        type: String, 
        required: true 
    },
    description: {
        type: String 
    }
}, {
    timestamps: true // Automatically tracks creation and update times [2]
});

// Creating and exporting the model
const book = mongus.model("book", bookSchema); 

export default book; 