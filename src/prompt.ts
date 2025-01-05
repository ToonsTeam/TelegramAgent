import { Anthropic } from '@anthropic-ai/sdk';
import { PromptGenResponse } from './types';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY must be provided!');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generatePrompt(character: string): Promise<PromptGenResponse> {
  console.log('Generating prompt for character(s):', character);
  
  const msg = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `Generate a creative image prompt featuring: ${character}

Requirements:
- Must include the character(s) in a thug/rapper style scene
- Must include the text "$TOONS" (exactly like that) prominently displayed
- Include luxury brands (like Gucci, LV, Versace)
- Include a luxury car with custom features
- Include smoking/drinking elements
- Set in a dark urban environment
- Specify high-quality rendering (8k, photorealistic, etc.)
- Make it creative but keep the thug life aesthetic

Example format (but be creative with details):
"{Characters}, looking drunk and high, wearing designer clothes with gold chains, blunts in their mouths, luxury car details, sippin lean, smoke effects, the words $TOONS prominent, ultra detailed background description, rendering quality specs"

Generate only the prompt text, no explanations.`
    }],
    system: "You are a creative prompt engineer specializing in thug life aesthetics. Always include $TOONS prominently. Never use any other text/ticker symbol. Maintain dark, gritty atmosphere while varying specific details like cars, clothes, backgrounds, and effects. Focus on high-end luxury elements and intoxicated vibes."
  });

  const promptText = msg.content[0].type === 'text' ? msg.content[0].text : '';
  console.log('Claude response:', promptText);
  
  return { prompt: promptText };
} 