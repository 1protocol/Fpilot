'use server';

/**
 * @fileOverview Extracts tunable parameters from a trading strategy's code.
 *
 * - extractStrategyParameters - A function that analyzes strategy code to find parameters.
 * - ExtractStrategyParametersInput - The input type for the function.
 * - ExtractStrategyParametersOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractStrategyParametersInputSchema = z.object({
  strategyCode: z.string().describe('The Typescript code of the trading strategy.'),
});
export type ExtractStrategyParametersInput = z.infer<typeof ExtractStrategyParametersInputSchema>;

const ExtractStrategyParametersOutputSchema = z.object({
    parameters: z.record(z.string(), z.object({
        min: z.number().describe("The suggested minimum value for this parameter."),
        max: z.number().describe("The suggested maximum value for this parameter."),
    })).describe('A dictionary of tunable parameters found in the code, with suggested min/max optimization ranges.'),
});
export type ExtractStrategyParametersOutput = z.infer<typeof ExtractStrategyParametersOutputSchema>;

export async function extractStrategyParameters(
  input: ExtractStrategyParametersInput
): Promise<ExtractStrategyParametersOutput> {
  return extractStrategyParametersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractStrategyParametersPrompt',
  input: {schema: ExtractStrategyParametersInputSchema},
  output: {schema: ExtractStrategyParametersOutputSchema},
  prompt: `You are an expert in analyzing algorithmic trading strategy code. Your task is to analyze the provided Typescript code and identify all the tunable parameters that could be optimized.

For each parameter you identify, suggest a reasonable minimum and maximum value for optimization purposes.

Focus on variables that control the strategy's logic, such as indicator periods (e.g., RSI length, moving average periods), thresholds (e.g., overbought/oversold levels), and risk management values (e.g., stop-loss percentage, take-profit percentage).

Do not include parameters that are related to asset names, timeframes, or exchange details.

Strategy Code:
\'\'\'typescript
{{{strategyCode}}}
\'\'\'

Extract the parameters and their suggested optimization ranges.`,
});

const extractStrategyParametersFlow = ai.defineFlow(
  {
    name: 'extractStrategyParametersFlow',
    inputSchema: ExtractStrategyParametersInputSchema,
    outputSchema: ExtractStrategyParametersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
