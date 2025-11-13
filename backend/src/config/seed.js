import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedPath = join(__dirname, '../../../SEED.txt');
const seed = readFileSync(seedPath, 'utf-8').trim();

const A = 7 + (parseInt(seed.substring(0, 2), 16) % 5);
const B = 13 + (parseInt(seed.substring(2, 4), 16) % 7);
const C = 3 + (parseInt(seed.substring(4, 6), 16) % 3);

export const SEED = seed;
export const COEFFICIENTS = { A, B, C };

export function calculatePriorityScore(signupLatencyMs, accountAgeDays, rapidActions) {
  const base = 1000;
  return base + (signupLatencyMs % COEFFICIENTS.A) + (accountAgeDays % COEFFICIENTS.B) - (rapidActions % COEFFICIENTS.C);
}

