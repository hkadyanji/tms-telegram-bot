import * as flags from 'https://deno.land/std/flags/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';

const env = config();

export const PORT = flags.parse(Deno.args).port ?? Number(env.PORT);
