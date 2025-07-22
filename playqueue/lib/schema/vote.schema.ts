import { z } from "zod";

export const VoteSchema = z.object({
  streamId: z.string(),
});

export type VoteType = z.infer<typeof VoteSchema>;
