'use server';

/**
 * @fileOverview Provides prompt suggestions to help users start generating images.
 *
 * - suggestPrompt - A function that returns a suggested prompt for image generation.
 * - SuggestPromptInput - The input type for the suggestPrompt function.
 * - SuggestPromptOutput - The return type for the suggestPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPromptInputSchema = z.object({
  topic: z.string().describe('The topic for which a prompt is suggested.'),
});
export type SuggestPromptInput = z.infer<typeof SuggestPromptInputSchema>;

const SuggestPromptOutputSchema = z.object({
  prompt: z.string().describe('The suggested prompt for image generation.'),
});
export type SuggestPromptOutput = z.infer<typeof SuggestPromptOutputSchema>;

export async function suggestPrompt(input: SuggestPromptInput): Promise<SuggestPromptOutput> {
  return suggestPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPromptPrompt',
  input: {schema: SuggestPromptInputSchema},
  output: {schema: SuggestPromptOutputSchema},
  prompt: `You are an AI prompt generator. Generate a creative and detailed prompt based on the given topic.

Topic: {{{topic}}}

Prompt: `,
});

const suggestPromptFlow = ai.defineFlow(
  {
    name: 'suggestPromptFlow',
    inputSchema: SuggestPromptInputSchema,
    outputSchema: SuggestPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
