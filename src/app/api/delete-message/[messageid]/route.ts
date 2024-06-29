import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
 
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

  try {

    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
   
    if (updateResult.modifiedCount == 0) {
    
      return Response.json(
        {
          success: false,
          message: "Message not found." + messageId,
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message deleted.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in delete-message:", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred.",
      },
      { status: 500 }
    );
  }
}
