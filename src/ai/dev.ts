import { config } from 'dotenv';
config();

import '@/ai/flows/automated-strategy-parameter-tuning.ts';
import '@/ai/flows/generate-trading-strategy-from-prompt.ts';
import '@/ai/flows/summarize-market-sentiment.ts';
import '@/ai/flows/predict-market-regime.ts';
