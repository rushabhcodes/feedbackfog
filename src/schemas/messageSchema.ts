import { z } from "zod";

export const messageSchema = z.object({
    content: z
    .string()
    .min(3, {message:"Message must be at least 3 character long"})
    .max(500, {message:"Message must be at most 500 characters long"}),
});
