import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// Define an async function for handling the API request
export async function GET(req: Request) {
  try {
    // Parse URL to extract query parameters from the request
    const url = new URL(req.url);

    // Get the user's custom role (e.g., Influencer) or default to 'Influencer'
    const role = url.searchParams.get('role') || 'Influencer';

    // Create a broader set of random contexts
    const contexts = [
      `As an expert in the ${role} field, what might fans ask?`,
      `Fans of a prominent ${role} might be curious about these topics:`,
      `Imagine a ${role} interacting with their fans. What questions could arise?`,
      `Consider a ${role} answering fan queries. What are three questions they might encounter?`,
      `If you were a ${role}, what unique questions would your fans ask?`
    ];
    
    // Randomly select a context
    const randomContext = contexts[Math.floor(Math.random() * contexts.length)];

    // Construct the prompt using the user's role and a random context
    const prompt = `${randomContext} Generate three different questions likely to be asked. Ensure each question is unique and provide variation.`;

    // Randomly vary the temperature
    const temperature = Math.random() * 0.5 + 0.5; // Random between 0.5 and 1.0

    // Generate text using the Google model
    const { text } = await generateText({
      model: google('models/gemini-1.5-flash-latest'),
      prompt,
      system: 'You return three questions in array format. Do not return anything else.',
      temperature,
    });

    // Assuming the AI response is a stringified array, parse it into an actual array
    const questions = JSON.parse(text);

    // Ensure the response is an array of exactly three strings
    if (Array.isArray(questions) && questions.length === 3) {
      return NextResponse.json({ questions });
    } else {
      throw new Error('Generated response is not an array with three questions');
    }
  } catch (error) {
    // Handle errors and return a failure response
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
 