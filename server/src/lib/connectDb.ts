import mongoose from "mongoose";
const URI = process.env.MONGODB_URI

export const connectDb = async()=>{
    try {
         if(!URI){
        console.log("URI BHGU BN");
        return;
    }

await mongoose.connect(URI)
    } catch (error) {
        console.log("db tei holbogdohod eroor garlaa", error)
    }

   
}