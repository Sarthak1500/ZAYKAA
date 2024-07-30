import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb+srv://krishnasarthak513:krishnasarthak513@cluster0.ab5wfg9.mongodb.net/food-del')
    .then(()=>console.log("DB Connected"));
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.