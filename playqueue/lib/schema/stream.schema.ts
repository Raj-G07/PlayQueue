import {z} from "zod";

export const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
  spaceId: z.string()
});

export type CreateStreamType = z.infer<typeof CreateStreamSchema>;
