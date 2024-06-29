import { z } from "zod";

export const usernameValidation = z
.string()
.min(3, "Username must be at least 3 characters long")
.max(30, "Username must be at most 30 characters long")
.regex(/^[a-zA-Z0-9_]*$/, "Username must contain only letters, numbers, and underscores");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z
    .string()
    .email({message:"Please fill a valid email address"}),
    password: z
    .string()
    .min(8, {message:"Password must be at least 8 characters long"}), 
});

