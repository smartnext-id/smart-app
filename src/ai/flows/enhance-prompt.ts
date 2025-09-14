'use server';

/**
 * @fileOverview This file contains a Genkit flow for enhancing user prompts to improve image generation quality.
 *
 * It includes:
 * - enhancePrompt - A function that takes a user prompt and enhances it with additional details and keywords.
 * - EnhancePromptInput - The input type for the enhancePrompt function.
 * - EnhancePromptOutput - The return type for the enhancePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhancePromptInputSchema = z.object({
  prompt: z.string().describe('The original user prompt for image generation.'),
});
export type EnhancePromptInput = z.infer<typeof EnhancePromptInputSchema>;

const EnhancePromptOutputSchema = z.object({
  enhancedPrompt: z.string().describe('The enhanced prompt with added details and relevant keywords.'),
});
export type EnhancePromptOutput = z.infer<typeof EnhancePromptOutputSchema>;

export async function enhancePrompt(input: EnhancePromptInput): Promise<EnhancePromptOutput> {
  return enhancePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhancePromptPrompt',
  input: {schema: EnhancePromptInputSchema},
  output: {schema: EnhancePromptOutputSchema},
  prompt: `You are an AI prompt enhancer. Your goal is to improve the quality of a given prompt for image generation. Add details, relevant keywords, and phrases that will help the image generation model create a better image.

Original Prompt: {{{prompt}}}

Enhanced Prompt:`, // Crucially, MUST be formatted using Handlebars syntax. **Do not use Jinja, Django templates, or any other templating language.**
});

const enhancePromptFlow = ai.defineFlow(
  {
    name: 'enhancePromptFlow',
    inputSchema: EnhancePromptInputSchema,
    outputSchema: EnhancePromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
