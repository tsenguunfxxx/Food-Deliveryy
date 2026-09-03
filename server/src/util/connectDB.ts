import mongoose from "mongoose";
const URI = process.env.MONGODB_URI;
export const connectDb = async () => {
  console.log("URI", URI);
  if (!URI) {
    console.log("URI baihgui bn");
    return;
  }
  await mongoose.connect(URI);
};
