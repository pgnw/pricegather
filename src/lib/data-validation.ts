import { z } from 'zod';

export const userSchema = z.object({
    id: z.coerce.bigint(),
    username: z.string().min(1, "Username too short."),
    email: z.string().min(1, "Email too short."),
});