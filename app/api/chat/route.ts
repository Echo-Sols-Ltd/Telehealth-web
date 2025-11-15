import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// Mock AI responses for when OpenAI is unavailable
function getMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Heart rate related
  if (lowerMessage.includes("heart rate") || lowerMessage.includes("bpm")) {
    return `Your heart rate of 97 beats per minute (bpm) is slightly higher than the typical resting range for most adults (60-100 bpm).

Here are a few general steps that may help support a healthier heart rate:

1. **Relaxation techniques:** Try deep breathing, meditation, or light stretching to lower stress levels.

2. **Regular physical activity:** Moderate exercise such as walking, cycling, or yoga can help improve long-term heart health.

3. **Healthy habits:** Stay hydrated, limit caffeine/alcohol, and choose balanced meals rich in fruits, vegetables, and whole grains.

4. **Rest well:** Aim for 7-9 hours of sleep each night, as poor sleep can raise heart rate.

5. **Track patterns:** Monitor your heart rate regularly and note any symptoms like dizziness, chest pain, or shortness of breath.

**Important:** If you notice your heart rate is consistently high, or if you experience concerning symptoms, please seek medical advice from a healthcare professional.`;
  }

  // Blood pressure related
  if (
    lowerMessage.includes("blood pressure") ||
    lowerMessage.includes("pressure")
  ) {
    return `Blood pressure management is important for overall cardiovascular health.

Here are some general recommendations:

1. **Diet:** Reduce sodium intake, eat more fruits and vegetables, and maintain a balanced diet.

2. **Exercise:** Regular physical activity (at least 150 minutes per week) can help lower blood pressure.

3. **Stress management:** Practice relaxation techniques like meditation, deep breathing, or yoga.

4. **Monitor regularly:** Keep track of your blood pressure readings and share them with your healthcare provider.

5. **Lifestyle changes:** Maintain a healthy weight, limit alcohol consumption, and avoid smoking.

**Note:** If you have concerns about your blood pressure, please consult with a healthcare professional for personalized advice and monitoring.`;
  }

  // Temperature related
  if (lowerMessage.includes("temperature") || lowerMessage.includes("fever")) {
    return `Body temperature is an important indicator of health.

Normal body temperature typically ranges from 97°F (36.1°C) to 99°F (37.2°C).

Here are some general tips:

1. **Stay hydrated:** Drink plenty of fluids, especially water.

2. **Rest:** Get adequate rest to help your body recover.

3. **Monitor symptoms:** Keep track of your temperature and any accompanying symptoms.

4. **Comfort measures:** Use cool compresses or take a lukewarm bath if needed.

**Important:** If you have a persistent fever (above 100.4°F or 38°C), severe symptoms, or concerns about your temperature, please consult with a healthcare professional immediately.`;
  }

  // Glucose/sugar related
  if (
    lowerMessage.includes("glucose") ||
    lowerMessage.includes("sugar") ||
    lowerMessage.includes("diabetes")
  ) {
    return `Managing blood glucose levels is crucial for overall health.

Here are some general recommendations:

1. **Balanced diet:** Eat regular meals with a mix of carbohydrates, proteins, and healthy fats.

2. **Monitor levels:** Keep track of your blood glucose if recommended by your healthcare provider.

3. **Regular exercise:** Physical activity can help regulate blood sugar levels.

4. **Stay hydrated:** Drink plenty of water throughout the day.

5. **Limit processed foods:** Choose whole grains, fruits, and vegetables over refined sugars.

**Note:** If you have diabetes or concerns about your blood glucose levels, please work closely with your healthcare provider for personalized management strategies.`;
  }

  // General health questions
  if (
    lowerMessage.includes("health") ||
    lowerMessage.includes("wellness") ||
    lowerMessage.includes("improve")
  ) {
    return `I'm here to help with general health and wellness information.

Here are some foundational tips for maintaining good health:

1. **Regular exercise:** Aim for at least 150 minutes of moderate-intensity exercise per week.

2. **Balanced nutrition:** Eat a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats.

3. **Adequate sleep:** Aim for 7-9 hours of quality sleep each night.

4. **Stress management:** Practice relaxation techniques and find healthy ways to manage stress.

5. **Regular check-ups:** Schedule routine health screenings and consultations with your healthcare provider.

6. **Stay hydrated:** Drink plenty of water throughout the day.

7. **Avoid harmful habits:** Limit alcohol, avoid smoking, and practice moderation.

**Remember:** For specific health concerns or symptoms, always consult with a qualified healthcare professional for personalized advice and treatment.`;
  }

  // Default response
  return `Thank you for your question. I'm a health assistant designed to provide general wellness information.

While I can offer general guidance, I want to emphasize that I'm not a replacement for professional medical advice, diagnosis, or treatment.

For specific health concerns, symptoms, or medical questions, I strongly recommend consulting with a qualified healthcare professional who can provide personalized advice based on your medical history and current condition.

Is there a specific aspect of health or wellness you'd like to learn more about? I can provide general information on topics like:
- Heart health and cardiovascular wellness
- Nutrition and healthy eating
- Exercise and physical activity
- Sleep and rest
- Stress management
- General wellness tips

Please note: If you're experiencing a medical emergency or severe symptoms, please seek immediate medical attention.`;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Try OpenAI first if available
    if (openai && process.env.OPENAI_API_KEY) {
      try {
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
      } catch (openaiError: any) {
        // If OpenAI fails (quota exceeded, etc.), fall back to mock responses
        console.warn(
          "OpenAI API unavailable, using mock response:",
          openaiError.message
        );
        const mockResponse = getMockResponse(message);
        return NextResponse.json({ response: mockResponse });
      }
    }

    // Use mock responses when OpenAI is not configured
    const mockResponse = getMockResponse(message);
    return NextResponse.json({ response: mockResponse });
  } catch (error: any) {
    console.error("Chat API error:", error);
    // Even on error, try to provide a helpful response
    const mockResponse = getMockResponse("");
    return NextResponse.json({ response: mockResponse });
  }
}
