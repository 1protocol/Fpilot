'use server';

/**
 * @fileOverview Runs a backtest simulation for a given trading strategy using AI.
 *
 * - runBacktestSimulation - A function that simulates a backtest and returns performance metrics.
 * - BacktestSimulationInput - The input type for the function.
 * - BacktestSimulationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BacktestSimulationInputSchema = z.object({
  strategyCode: z.string().describe('The Typescript code of the trading strategy to backtest.'),
  asset: z.string().describe('The asset to run the backtest on (e.g., BTC/USDT).'),
  dateRange: z.string().describe('The historical date range for the backtest (e.g., "last 12 months").'),
});
export type BacktestSimulationInput = z.infer<typeof BacktestSimulationInputSchema>;

const EquityDataPointSchema = z.object({
    date: z.string().describe("The date for this data point, in YYYY-MM-DD format."),
    equity: z.number().describe("The total equity value on this date."),
});

const TradeSchema = z.object({
    side: z.enum(['Buy', 'Sell']).describe("The side of the trade."),
    price: z.number().describe("The execution price of the trade."),
    size: z.number().describe("The size or quantity of the trade."),
    pnl: z.number().describe("The profit or loss from this trade."),
});

const BacktestSimulationOutputSchema = z.object({
  netProfit: z.number().describe("The total net profit or loss from the simulation."),
  sharpeRatio: z.number().describe("The calculated Sharpe ratio, a measure of risk-adjusted return."),
  maxDrawdown: z.number().describe("The maximum drawdown percentage experienced during the simulation."),
  winRate: z.number().describe("The percentage of trades that were profitable."),
  profitFactor: z.number().describe("The ratio of gross profit to gross loss."),
  totalTrades: z.number().describe("The total number of trades executed."),
  equityCurveData: z.array(EquityDataPointSchema).length(12).describe("An array of 12 data points representing the monthly equity curve over the simulation period."),
  trades: z.array(TradeSchema).max(20).describe("A list of up to 20 sample trades executed during the simulation."),
});
export type BacktestSimulationOutput = z.infer<typeof BacktestSimulationOutputSchema>;

export async function runBacktestSimulation(
  input: BacktestSimulationInput
): Promise<BacktestSimulationOutput> {
  return runBacktestSimulationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'runBacktestSimulationPrompt',
  input: {schema: BacktestSimulationInputSchema},
  output: {schema: BacktestSimulationOutputSchema},
  prompt: `You are an advanced trading backtest simulation engine. Your task is to simulate the performance of a given trading strategy over a specified historical period and return a comprehensive set of performance metrics.

Generate realistic but simulated results. The results should be internally consistent and reflect the likely outcome of the provided strategy logic. For example, a simple RSI mean-reversion strategy in a choppy market should have many small trades and a decent win rate, while a trend-following strategy in a strong bull market should show large winning trades.

Backtest Parameters:
- Asset: {{{asset}}}
- Date Range: {{{dateRange}}}
- Strategy Code:
\'\'\'typescript
{{{strategyCode}}}
\'\'\'

Based on these parameters, run a simulation and generate the following outputs:
- netProfit: Total net profit.
- sharpeRatio: A realistic Sharpe ratio (typically between 0.5 and 2.5).
- maxDrawdown: A realistic maximum drawdown percentage (typically between 5% and 30%).
- winRate: Percentage of winning trades.
- profitFactor: A realistic profit factor (typically between 1.0 and 3.0).
- totalTrades: The total number of trades.
- equityCurveData: An array of exactly 12 data points representing the equity on a monthly basis. The dates should span the requested date range. Start with a hypothetical 100,000 equity.
- trades: An array of up to 20 sample trades, showing a mix of buys and sells with realistic prices and PnL.

Ensure all numbers are realistic and the entire output object is consistent.`,
});

const runBacktestSimulationFlow = ai.defineFlow(
  {
    name: 'runBacktestSimulationFlow',
    inputSchema: BacktestSimulationInputSchema,
    outputSchema: BacktestSimulationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
