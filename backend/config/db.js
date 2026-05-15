import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://<db_username>:<db_password>@teach.xclxs7q.mongodb.net/?appName=Teach')
        .then(() => console.log('DB Connected'))
}