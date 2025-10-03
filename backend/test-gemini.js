import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key present:', !!process.env.GEMINI_API_KEY);
    console.log('API Key (first 10 chars):', process.env.GEMINI_API_KEY?.substring(0, 10));
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: 'Say hello in JSON format: {"message": "hello"}'
    });
    
    console.log('✅ Success!');
    console.log('Response:', response.text);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testGemini();
