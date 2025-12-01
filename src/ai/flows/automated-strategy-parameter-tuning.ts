'use server';

/**
 * @fileOverview This file defines a Genkit flow for automated strategy parameter tuning using AI.
 *
 * The flow allows users to automatically fine-tune the parameters of their trading strategies,
 * enabling the strategies to adapt to changing market conditions and improve performance over time.
 *
 * - automatedStrategyParameterTuning - The main function to initiate the automated parameter tuning process.
 * - AutomatedStrategyParameterTuningInput - The input type for the automatedStrategyParameterTuning function.
 * - AutomatedStrategyParameterTuningOutput - The return type for the automatedStrategyParameterTuning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the automated strategy parameter tuning flow
const AutomatedStrategyParameterTuningInputSchema = z.object({
  strategyName: z.string().describe('The name of the trading strategy to optimize.'),
  marketConditions: z.string().describe('The current market conditions to adapt to.'),
  performanceMetric: z.string().describe('The performance metric to optimize for (e.g., Sharpe ratio, profit factor).'),
  parameterConstraints: z.record(z.string(), z.any()).describe('Constraints for each parameter to ensure realistic and safe parameter tuning.'),
});
export type AutomatedStrategyParameterTuningInput = z.infer<typeof AutomatedStrategyParameterTuningInputSchema>;

// Define the output schema for the automated strategy parameter tuning flow
const AutomatedStrategyParameterTuningOutputSchema = z.object({
  optimalParameters: z.record(z.string(), z.any()).describe('The optimized parameters for the trading strategy.'),
  expectedPerformance: z.number().describe('The expected performance of the strategy with the optimized parameters.'),
  tuningRationale: z.string().describe('Rationale for the parameter tuning decisions made by the AI.'),
});
export type AutomatedStrategyParameterTuningOutput = z.infer<typeof AutomatedStrategyParameterTuningOutputSchema>;

// Exported function to initiate the automated strategy parameter tuning process
export async function automatedStrategyParameterTuning(
  input: AutomatedStrategyParameterTuningInput
): Promise<AutomatedStrategyParameterTuningOutput> {
  return automatedStrategyParameterTuningFlow(input);
}

// Define the prompt for the automated strategy parameter tuning flow
const automatedStrategyParameterTuningPrompt = ai.definePrompt({
  name: 'automatedStrategyParameterTuningPrompt',
  input: {schema: AutomatedStrategyParameterTuningInputSchema},
  output: {schema: AutomatedStrategyParameterTuningOutputSchema},
  prompt: `You are an AI-powered trading strategy parameter optimizer. Your goal is to fine-tune the parameters of a given trading strategy to maximize its performance under current market conditions.

  Strategy Name: {{{strategyName}}}
  Market Conditions: {{{marketConditions}}}
  Performance Metric: {{{performanceMetric}}}
  Parameter Constraints: {{{parameterConstraints}}}

  Based on the above information, determine the optimal parameters for the trading strategy and provide a rationale for your decisions.
  Make sure that parameters adhere to specified constraints.
  Output the result in JSON format with keys "optimalParameters", "expectedPerformance", and "tuningRationale".`,
});

// Define the Genkit flow for automated strategy parameter tuning
const automatedStrategyParameterTuningFlow = ai.defineFlow(
  {
    name: 'automatedStrategyParameterTuningFlow',
    inputSchema: AutomatedStrategyParameterTuningInputSchema,
    outputSchema: AutomatedStrategyParameterTuningOutputSchema,
  },
  async input => {
    const {output} = await automatedStrategyParameterTuningPrompt(input);
    return output!;
  }
);
