'use server';

/**
 * @fileOverview Applies tuned parameters back into the strategy's source code.
 *
 * - applyTunedParameters - A function that takes strategy code and new parameters, and returns the updated code.
 * - ApplyTunedParametersInput - The input type for the function.
 * - ApplyTunedParametersOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ApplyTunedParametersInputSchema = z.object({
  strategyCode: z.string().describe('The original Typescript code of the trading strategy.'),
  optimalParameters: z.record(z.any()).describe('A dictionary of the optimal parameters to apply to the code.'),
});
export type ApplyTunedParametersInput = z.infer<typeof ApplyTunedParametersInputSchema>;

const ApplyTunedParametersOutputSchema = z.object({
  updatedStrategyCode: z.string().describe('The full strategy code with the new parameter values injected.'),
});
export type ApplyTunedParametersOutput = z.infer<typeof ApplyTunedParametersOutputSchema>;

export async function applyTunedParameters(
  input: ApplyTunedParametersInput
): Promise<ApplyTunedParametersOutput> {
  return applyTunedParametersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'applyTunedParametersPrompt',
  input: {schema: ApplyTunedParametersInputSchema},
  output: {schema: ApplyTunedParametersOutputSchema},
  prompt: `You are an expert at surgically modifying Typescript code for trading strategies.

Your task is to take the original strategy code and replace the values of the variables with the new values provided in the optimal parameters object.

- Only change the values of the variables defined in the optimal parameters.
- Do NOT change variable names, logic, comments, or any other part of the code.
- Return the complete, updated source code.

**Original Strategy Code:**
\'\'\'typescript
{{{strategyCode}}}
\'\'\'

**Optimal Parameters to Apply:**
\'\'\'json
{{{JSON.stringify optimalParameters}}}
\'\'\'

Update the code and provide the full result in the 'updatedStrategyCode' field.`,
});

const applyTunedParametersFlow = ai.defineFlow(
  {
    name: 'applyTunedParametersFlow',
    inputSchema: ApplyTunedParametersInputSchema,
    outputSchema: ApplyTunedParametersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
