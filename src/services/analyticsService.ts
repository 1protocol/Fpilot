'use server';

/**
 * @fileOverview This service acts as an intermediary between the UI components
 * and the AI flows related to market analytics.
 */

import {
  predictMarketRegime as predictMarketRegimeFlow,
  type PredictMarketRegimeInput,
  type PredictMarketRegimeOutput,
} from '@/ai/flows/predict-market-regime';

import {
  generateTradingSignal as generateTradingSignalFlow,
  type GenerateTradingSignalInput,
  type GenerateTradingSignalOutput,
} from '@/ai/flows/generate-trading-signal';

export { type GenerateTradingSignalInput, type GenerateTradingSignalOutput };

/**
 * Predicts the market regime for a given cryptocurrency.
 *
 * @param input - The input for the regime prediction.
 * @returns A promise that resolves to the market regime prediction.
 */
export async function predictMarketRegime(
  input: PredictMarketRegimeInput
): Promise<PredictMarketRegimeOutput> {
  return predictMarketRegimeFlow(input);
}

/**
 * Generates a trading signal based on user-defined parameters.
 *
 * @param input - The input for the signal generation.
 * @returns A promise that resolves to the generated trading signal.
 */
export async function generateTradingSignal(
  input: GenerateTradingSignalInput
): Promise<GenerateTradingSignalOutput> {
  return generateTradingSignalFlow(input);
}
