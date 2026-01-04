'use server';

/**
 * @fileOverview Generates a trading signal based on a specific strategy, risk profile, and market data.
 *
 * - generateTradingSignal - A function that generates a trading signal.
 * - GenerateTradingSignalInput - The input type for the generateTradingSignal function.
 * - GenerateTradingSignalOutput - The return type for the generateTradingSignal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskProfileSchema = z.object({
  valueAtRisk: z.number().describe("The user's Value at Risk (VaR) percentage."),
  maxPositionSize: z.number().describe("The user's maximum position size percentage per trade."),
});

const GenerateTradingSignalInputSchema = z.object({
    strategyCode: z.string().describe('The Typescript code of the trading strategy to use for signal generation.'),
    riskProfile: RiskProfileSchema.describe("The user's personal risk profile."),
    cryptocurrency: z.string().describe('The cryptocurrency for which to generate the signal (e.g., BTC/USDT).')
});
export type GenerateTradingSignalInput = z.infer<typeof GenerateTradingSignalInputSchema>;

const GenerateTradingSignalOutputSchema = z.object({
  signal: z.enum(['Buy', 'Sell', 'Hold']).describe('The generated trading signal: Buy, Sell, or Hold.'),
  targetPrice: z.number().describe('A realistic target price for the signal.'),
  rationale: z.string().describe('The justification for the generated signal, based on the strategy code and risk profile.'),
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
  prompt: `You are an expert AI trading signal generator for a platform called FPILOT. Your task is to generate a trading signal by interpreting a user's strategy code in the context of their risk profile.

Analyze the provided strategy code, the user's risk parameters, and simulated market data for the given cryptocurrency.

**Cryptocurrency:** {{{cryptocurrency}}}

**User's Risk Profile:**
- Value at Risk (VaR): {{{riskProfile.valueAtRisk}}}%
- Maximum Position Size: {{{riskProfile.maxPositionSize}}}% of total portfolio per trade.

**Strategy Code to Execute:**
\'\'\'typescript
{{{strategyCode}}}
\'\'\'

**Your Task:**
1.  **Simulate Market Analysis:** Pretend to analyze current (simulated) market indicators (RSI, MACD, Moving Averages, etc.) for the specified cryptocurrency.
2.  **Apply Strategy Logic:** Interpret the user's strategy code against your simulated market data.
3.  **Incorporate Risk Profile:** The user's risk profile MUST influence your decision. For example, a high-risk profile might allow for acting on weaker signals, while a low-risk profile demands stronger confirmation. A small max position size might lead to more frequent, smaller trades or a 'Hold' signal if the potential trade size is too large.
4.  **Generate Signal:** Based on the synthesis of market data, strategy logic, and risk profile, decide whether to issue a 'Buy', 'Sell', or 'Hold' signal.
5.  **Determine Target Price:** Set a realistic target price for the trade.
6.  **Provide Rationale:** Explain your reasoning clearly, referencing both the strategy's logic and how the risk profile influenced the final decision (e.g., "Signal is 'Buy' based on EMA crossover in the strategy, but confidence is moderate due to the user's conservative risk profile, so a tight stop-loss is implied.").
7.  **Adhere strictly to the output schema.**`,
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
