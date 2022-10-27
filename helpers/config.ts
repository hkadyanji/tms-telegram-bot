import * as flags from 'https://deno.land/std/flags/mod.ts';

export const PORT = flags.parse(Deno.args).port ?? Number(Deno.env.get('PORT'));
