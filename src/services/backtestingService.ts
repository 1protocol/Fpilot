'use server';

/**
 * @fileOverview This service acts as an intermediary between the UI components
 * and the AI flows related to backtesting.
 */

import {
  runBacktestSimulation as runBacktestSimulationFlow,
  type BacktestSimulationInput,
  type BacktestSimulationOutput,
} from '@/ai/flows/run-backtest-simulation';

export { type BacktestSimulationInput, type BacktestSimulationOutput };

/**
 * Runs an AI-powered simulation of a trading strategy backtest.
 *
 * @param input - The input for the backtest simulation, including strategy code, asset, and date range.
 * @returns A promise that resolves to the simulated backtest performance metrics.
 */
export async function runBacktestSimulation(
  input: BacktestSimulationInput
): Promise<BacktestSimulationOutput> {
  return runBacktestSimulationFlow(input);
}
