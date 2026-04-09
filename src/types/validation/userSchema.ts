import { z } from "zod";

export const createUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    userName: z.string().min(1, "Username is required"),
    password: z.string()
        .min(8, "At least 8 characters")
        .regex(/[A-Z]/, "Must include uppercase letter")
        .regex(/[a-z]/, "Must include lowercase letter")
        .regex(/[0-9]/, "Must include a number")
        .regex(/[^A-Za-z0-9]/, "Must include a special character"),
});

export const updateUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    userName: z.string().min(1, "Username is required"),

    password: z.string()
        .min(8, "At least 8 characters")
        .regex(/[A-Z]/, "Must include uppercase letter")
        .regex(/[a-z]/, "Must include lowercase letter")
        .regex(/[0-9]/, "Must include a number")
        .regex(/[^A-Za-z0-9]/, "Must include a special character").optional(),

    changePassword: z.boolean()
}).superRefine((data, ctx) => {
    if (data.changePassword) {
        if (!data.password || data.password.length < 5) {
            ctx.addIssue({
                path: ["password"],
                code: z.ZodIssueCode.custom,
                message: "Min 5 characters",
            });
        }
    }
});

export type CreateUserForm = z.infer<typeof createUserSchema>;