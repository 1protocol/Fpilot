'use server';
/**
 * @fileOverview Generates a trading strategy from a user-provided prompt.
 *
 * - generateTradingStrategy - A function that generates a trading strategy.
 * - GenerateTradingStrategyInput - The input type for the generateTradingStrategy function.
 * - GenerateTradingStrategyOutput - The return type for the generateTradingStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTradingStrategyInputSchema = z.object({
  prompt: z
    .string()
    .describe('A prompt describing the desired trading strategy.'),
});
export type GenerateTradingStrategyInput = z.infer<
  typeof GenerateTradingStrategyInputSchema
>;

const GenerateTradingStrategyOutputSchema = z.object({
  strategyCode: z
    .string()
    .describe('The generated trading strategy code.'),
  explanation: z
    .string()
    .describe('Explanation of the generated trading strategy.'),
});
export type GenerateTradingStrategyOutput = z.infer<
  typeof GenerateTradingStrategyOutputSchema
>;

export async function generateTradingStrategy(
  input: GenerateTradingStrategyInput
): Promise<GenerateTradingStrategyOutput> {
  return generateTradingStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTradingStrategyPrompt',
  input: {schema: GenerateTradingStrategyInputSchema},
  output: {schema: GenerateTradingStrategyOutputSchema},
  prompt: `You are an expert algorithmic trading strategy generator.

You will generate a trading strategy based on the user-provided prompt. The trading strategy should be in Typescript code and include comments explaining the logic. Return both the strategy code, and a high-level explanation of the strategy.

Prompt: {{{prompt}}}`,
});

const generateTradingStrategyFlow = ai.defineFlow(
  {
    name: 'generateTradingStrategyFlow',
    inputSchema: GenerateTradingStrategyInputSchema,
    outputSchema: GenerateTradingStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
