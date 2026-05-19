import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb string key')
        .then(() => console.log('DB Connected'))
}
