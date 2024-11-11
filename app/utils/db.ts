import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    const result = await mongoose.connect(process.env.MONGO_URI!);
    console.log("Db connected");
    return result;
  } catch (error: any) {
    console.log("Failed to connect", error);
    throw "Failed to connect";
  }
};
export { connectMongoDb };
