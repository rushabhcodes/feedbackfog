import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Using existing connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected =  db.connections[0].readyState 
    console.log("New DB Connection");
    console.log("DB Connection State:", connection.isConnected);
} 
  catch (error) {
    console.log("DB Connection Error:", error);
    process.exit(1);
  }
}

export default dbConnect;