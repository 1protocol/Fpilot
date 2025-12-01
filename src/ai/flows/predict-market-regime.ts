'use server';

/**
 * @fileOverview Predicts the market regime for a given cryptocurrency.
 *
 * - predictMarketRegime - A function that predicts the market regime.
 * - PredictMarketRegimeInput - The input type for the predictMarketRegime function.
 * - PredictMarketRegimeOutput - The return type for the predictMarketRegime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictMarketRegimeInputSchema = z.object({
  cryptocurrency: z.string().describe('The cryptocurrency to predict the market regime for (e.g., Bitcoin).'),
});
export type PredictMarketRegimeInput = z.infer<typeof PredictMarketRegimeInputSchema>;

const PredictMarketRegimeOutputSchema = z.object({
  regime: z.enum(['Bull', 'Bear', 'Sideways']).describe('The predicted market regime: Bull, Bear, or Sideways.'),
  rationale: z.string().describe('A brief explanation for the prediction, based on simulated technical and on-chain analysis.'),
  confidence: z.number().min(0).max(1).describe('The confidence level of the prediction, from 0 to 1.'),
});
export type PredictMarketRegimeOutput = z.infer<typeof PredictMarketRegimeOutputSchema>;

export async function predictMarketRegime(input: PredictMarketRegimeInput): Promise<PredictMarketRegimeOutput> {
  return predictMarketRegimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictMarketRegimePrompt',
  input: {schema: PredictMarketRegimeInputSchema},
  output: {schema: PredictMarketRegimeOutputSchema},
  prompt: `You are a sophisticated crypto market analysis AI. Your task is to predict the current market regime for {{cryptocurrency}}.
  
  Analyze simulated current technical indicators (like RSI, MACD, EMAs) and on-chain data (like NVT, SOPR).
  
  Based on this simulated analysis, determine if the market is in a 'Bull', 'Bear', or 'Sideways' regime.
  
  Provide a confidence score for your prediction and a brief rationale explaining the key factors that led to your conclusion.
  For example: "The market is showing signs of a Bull regime due to a strong upward trend in moving averages and positive on-chain sentiment."
  `,
});

const predictMarketRegimeFlow = ai.defineFlow(
  {
    name: 'predictMarketRegimeFlow',
    inputSchema: PredictMarketRegimeInputSchema,
    outputSchema: PredictMarketRegimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
