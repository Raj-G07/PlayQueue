import {z} from "zod";

export const CredentialsSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type CredentialsType = z.infer<typeof CredentialsSchema>;