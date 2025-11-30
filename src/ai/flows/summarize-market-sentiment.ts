'use server';

/**
 * @fileOverview Summarizes market sentiment for a given cryptocurrency.
 *
 * - summarizeMarketSentiment - A function that summarizes the market sentiment.
 * - SummarizeMarketSentimentInput - The input type for the summarizeMarketSentiment function.
 * - SummarizeMarketSentimentOutput - The return type for the summarizeMarketSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMarketSentimentInputSchema = z.object({
  cryptocurrency: z.string().describe('The cryptocurrency to summarize sentiment for (e.g., Bitcoin).'),
});
export type SummarizeMarketSentimentInput = z.infer<typeof SummarizeMarketSentimentInputSchema>;

const SummarizeMarketSentimentOutputSchema = z.object({
  summary: z.string().describe('A summary of the recent news and social media sentiment for the given cryptocurrency.'),
});
export type SummarizeMarketSentimentOutput = z.infer<typeof SummarizeMarketSentimentOutputSchema>;

export async function summarizeMarketSentiment(input: SummarizeMarketSentimentInput): Promise<SummarizeMarketSentimentOutput> {
  return summarizeMarketSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMarketSentimentPrompt',
  input: {schema: SummarizeMarketSentimentInputSchema},
  output: {schema: SummarizeMarketSentimentOutputSchema},
  prompt: `Summarize the recent news and social media sentiment for {{cryptocurrency}}. Focus on the overall market mood and significant trends.`,
});

const summarizeMarketSentimentFlow = ai.defineFlow(
  {
    name: 'summarizeMarketSentimentFlow',
    inputSchema: SummarizeMarketSentimentInputSchema,
    outputSchema: SummarizeMarketSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
