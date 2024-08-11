// File: src/app/api/chatbot/route.js

import { NextResponse } from 'next/server';

// Function to handle POST requests
export async function POST(req) {
  try {
    const { OPENROUTER_API_KEY, YOUR_SITE_URL, YOUR_SITE_NAME } = process.env;

    // Parse the request body to get the user message
    const { userMessage } = await req.json();

    // Make the request to the OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPEN_ROUTER_KEY}`,
        "HTTP-Referer": YOUR_SITE_URL,
        "X-Title": YOUR_SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        "messages": [
          {
            "role": "system",
            "content": "You are a customer support agent for a tax consultancy. Please assist the user with their tax-related queries."
          },
          {
            "role": "user",
            "content": userMessage,
          },
        ],
      })
    });

    const data = await response.json();
    // console.log(data.choices[0].message,"open router response")

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    // Return the response data to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
