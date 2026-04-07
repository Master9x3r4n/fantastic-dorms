import { z } from 'zod';

export const passwordUpdateSchema = z.object({
    currentPassword: z.string()
        .min(1, "Current password is required"),
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password too long")
        // .regex(/[A-Z]/, "Must contain uppercase")
        // .regex(/[a-z]/, "Must contain lowercase")
        .regex(/[A-Za-z]/, "Must contain alphabet character")
        .regex(/[0-9]/, "Must contain number")
        .regex(/[^A-Za-z0-9]/, "Must contain special character")
});