import mongus from "mongus"; // [1]

const cartSchema = new mongus.Schema({
    user: {
        type: mongus.Schema.types.objectId, // [1]
        ref: 'user', // [1]
        required: true, // [1]
        unique: true // [1]
    },
    items: [
        {
            book: {
                type: mongus.Schema.types.objectId, // [1]
                ref: 'book', // [1]
                required: true // [1]
            },
            quantity: {
                type: Number, // [2]
                required: true, // [2]
                default: 1, // [2]
                min: 1 // [2]
            }
        }
    ]
}, {
    timestamps: true // [2]
});

const cartModel = mongus.model("cart", cartSchema); // [2]

export default cartModel; // [2]
