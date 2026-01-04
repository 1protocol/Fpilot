'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/automated-strategy-parameter-tuning.ts';
import '@/ai/flows/generate-trading-strategy-from-prompt.ts';
import '@/ai/flows/summarize-market-sentiment.ts';
import '@/ai/flows/predict-market-regime.ts';
import '@/ai/flows/generate-trading-signal.ts';
import '@/ai/flows/extract-strategy-parameters.ts';
import '@/ai/flows/run-backtest-simulation.ts';
import '@/ai/flows/apply-tuned-parameters.ts';
