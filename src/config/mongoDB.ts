import mongoose from "mongoose";
import config from "./index";

 const mongoDBConnection = async () => {
    try {
        await mongoose.connect(config.database_url as string);
        console.log("database connected successfully");
        
        
    } catch (error) {
        console.log(error);
        console.log("Failed to connect mongodb");
        
    }
}

export default mongoDBConnection;