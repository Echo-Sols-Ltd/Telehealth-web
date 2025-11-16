import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Health-focused system prompt
    const systemPrompt = `You are a helpful and professional AI health assistant for TeleHealth. 
Your role is to provide general health information, wellness tips, and guidance based on user questions.
Always emphasize that you are not a replacement for professional medical advice.
When users ask about specific symptoms or conditions, recommend they consult with a healthcare professional.
Be empathetic, clear, and provide actionable advice when appropriate.
Format your responses in a clear, readable way with proper spacing and structure.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse =
      completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error:
          error.message || "Failed to generate AI response. Please try again.",
      },
      { status: 500 }
    );
  }
}
