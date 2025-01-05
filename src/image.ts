import { fal } from '@fal-ai/client';
import { ImageGenResponse } from './types';

if (!process.env.FAL_API_KEY) {
  throw new Error('FAL_API_KEY must be provided!');
}

fal.config({
  credentials: process.env.FAL_API_KEY,
});

export async function generateImage(prompt: string): Promise<ImageGenResponse> {
  console.log('Generating image with prompt:', prompt);
  
  try {
    const result = await fal.subscribe('fal-ai/flux-pro/v1.1', {
      input: {
        prompt,
        image_size: 'square_hd',
        num_images: 1,
        enable_safety_checker: false,
        safety_tolerance: "6",
        output_format: "jpeg"
      },
    });

    console.log('Raw API response:', JSON.stringify(result, null, 2));
    
    const data = result.data;
    if (!data?.images?.[0]?.url) {
      console.error('Invalid response structure:', data);
      throw new Error('No image URL in response');
    }

    return {
      image: data.images[0].url,
      prompt: prompt,
    };
  } catch (error) {
    console.error('Fal.ai API error:', error);
    throw error;
  }
} 