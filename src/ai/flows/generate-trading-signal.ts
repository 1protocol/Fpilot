'use server';

/**
 * @fileOverview Generates a trading signal based on user-defined strategy and risk level.
 *
 * - generateTradingSignal - A function that generates a trading signal.
 * - GenerateTradingSignalInput - The input type for the generateTradingSignal function.
 * - GenerateTradingSignalOutput - The return type for the generateTradingSignal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTradingSignalInputSchema = z.object({
    strategyType: z.enum(['Momentum', 'Mean Reversion', 'Arbitrage']).describe('The type of trading strategy to use for signal generation.'),
    riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The desired risk level for the trade signal.'),
    cryptocurrency: z.string().describe('The cryptocurrency for which to generate the signal.')
});
export type GenerateTradingSignalInput = z.infer<typeof GenerateTradingSignalInputSchema>;

const GenerateTradingSignalOutputSchema = z.object({
  signal: z.enum(['Buy', 'Sell', 'Hold']).describe('The generated trading signal: Buy, Sell, or Hold.'),
  targetPrice: z.number().describe('A realistic target price for the signal.'),
  rationale: z.string().describe('The justification for the generated signal, based on simulated market analysis.'),
});
export type GenerateTradingSignalOutput = z.infer<typeof GenerateTradingSignalOutputSchema>;

export async function generateTradingSignal(
  input: GenerateTradingSignalInput
): Promise<GenerateTradingSignalOutput> {
  return generateTradingSignalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTradingSignalPrompt',
  input: {schema: GenerateTradingSignalInputSchema},
  output: {schema: GenerateTradingSignalOutputSchema},
  prompt: `You are an expert AI trading signal generator. Based on the selected strategy, risk level, and cryptocurrency, generate a trading signal.

  Cryptocurrency: {{{cryptocurrency}}}
  Strategy Type: {{{strategyType}}}
  Risk Level: {{{riskLevel}}}

  - Simulate a market analysis for the given cryptocurrency.
  - Based on the strategy and risk level, decide whether to issue a 'Buy', 'Sell', or 'Hold' signal.
  - Determine a realistic target price for the trade.
  - Provide a brief rationale for your decision based on the simulated analysis (e.g., "RSI is overbought, suggesting a short-term reversal").
  - Adhere to the output schema.`,
});

const generateTradingSignalFlow = ai.defineFlow(
  {
    name: 'generateTradingSignalFlow',
    inputSchema: GenerateTradingSignalInputSchema,
    outputSchema: GenerateTradingSignalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
