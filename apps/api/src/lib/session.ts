import { z } from "zod";

/** UUID puro ou formato legado `anon-{uuid}` gerado no frontend. */
export const sessionIdSchema = z
  .string()
  .min(8)
  .max(80)
  .regex(
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|anon-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i,
    "sessionId inválido"
  );

export type SessionId = z.infer<typeof sessionIdSchema>;
