'use server';

/**
 * @fileOverview This service acts as an intermediary between the UI components
 * and the AI flows related to market sentiment analysis.
 */

import {
  summarizeMarketSentiment as summarizeMarketSentimentFlow,
  type SummarizeMarketSentimentInput,
  type SummarizeMarketSentimentOutput,
} from '@/ai/flows/summarize-market-sentiment';

/**
 * Summarizes the market sentiment for a given cryptocurrency.
 * This function calls the underlying AI flow and can be extended
 * with additional logic like caching or error handling in the future.
 *
 * @param input - The input for the sentiment analysis, containing the cryptocurrency name.
 * @returns A promise that resolves to the sentiment summary.
 */
export async function summarizeMarketSentiment(
  input: SummarizeMarketSentimentInput
): Promise<SummarizeMarketSentimentOutput> {
  // Here you could add caching, extra validation, or logging
  const result = await summarizeMarketSentimentFlow(input);
  // Post-processing of the result could also happen here
  return result;
}
