import * as flags from 'https://deno.land/std/flags/mod.ts';
import "https://deno.land/x/dotenv/load.ts";

export const PORT = flags.parse(Deno.args).port ?? Number(Deno.env.get('PORT'));
