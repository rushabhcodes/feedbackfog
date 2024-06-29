import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized.",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: {_id:'$_id', messages: {$push: '$messages'}} },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages found.",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User messages found.",
        messages: user[0].messages,
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error in get-messages:", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred.",
      },
      { status: 500 }
    );
  }
}
