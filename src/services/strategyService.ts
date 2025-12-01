'use server';

/**
 * @fileOverview This service acts as an intermediary between the UI components
 * and the AI flows related to trading strategies.
 */

import {
  generateTradingStrategy as generateTradingStrategyFlow,
  type GenerateTradingStrategyInput,
  type GenerateTradingStrategyOutput,
} from '@/ai/flows/generate-trading-strategy-from-prompt';

import {
  automatedStrategyParameterTuning as automatedStrategyParameterTuningFlow,
  type AutomatedStrategyParameterTuningInput,
  type AutomatedStrategyParameterTuningOutput,
} from '@/ai/flows/automated-strategy-parameter-tuning';

/**
 * Generates a trading strategy from a user-provided prompt.
 *
 * @param input - The input for the strategy generation.
 * @returns A promise that resolves to the generated trading strategy.
 */
export async function generateTradingStrategy(
  input: GenerateTradingStrategyInput
): Promise<GenerateTradingStrategyOutput> {
  return generateTradingStrategyFlow(input);
}

/**
 * Automatically tunes the parameters of a trading strategy using AI.
 *
 * @param input - The input for the parameter tuning.
 * @returns A promise that resolves to the optimized parameters and rationale.
 */
export async function automatedStrategyParameterTuning(
  input: AutomatedStrategyParameterTuningInput
): Promise<AutomatedStrategyParameterTuningOutput> {
  return automatedStrategyParameterTuningFlow(input);
}
