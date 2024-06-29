// Allow streaming responses up to 30 seconds
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const google = createGoogleGenerativeAI({
  // custom settings
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

export async function GET(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing insted on universal themes that encourage friendly interaction. For example your output should be structered like this: 'What's your favorite book and why?||What's the best advice you've ever received?||What's your dream vacation destination?' Give different questions avery time";

    const result = await streamText({
      model: google("models/gemini-1.5-pro-latest"),
      prompt: prompt,
      maxTokens: 400,
    });

    //  return Response.json({
    //   success: true,
    //   message: "Suggested messages fetched successfully",
    //   messages: result.toTextStreamResponse(),  // Assuming the API response contains an array of messages
    // });
     return result;
   

  } catch (error) {
    console.error("An Unexpected Error Occurred: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to suggest messages",
      },
      {
        status: 500,
      }
    );
  }
}
