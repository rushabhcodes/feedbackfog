import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/User.model";
import { z } from "zod";

// Mark route as dynamic since we're performing database operations
export const dynamic = 'force-dynamic';

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnect();
  
  try {
    const username = request.nextUrl.searchParams.get("username");
    const result = usernameQuerySchema.safeParse({ username });

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message: usernameErrors.length > 0
            ? usernameErrors.join(", ")
            : "Invalid query parameters.",
        },
        { status: 400 }
      );
    }

    const existingVerifiedUser = await UserModel.findOne({
      username: result.data.username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is available.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while checking the username.",
      },
      { status: 500 }
    );
  }
}