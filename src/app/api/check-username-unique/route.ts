import dbConnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { use } from "react";
import { join } from "path";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
//   if (request.method !== "GET") {
//     return Response.json(
//       {
//         success: false,
//         message: "Invalid request method.",
//       },
//       { status: 405 }
//     );
//   }
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParams);
    console.log("Result: ", result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters.",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken.",
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Checking username ", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while checking the username.",
      },
      { status: 500 }
    );
  }
}
