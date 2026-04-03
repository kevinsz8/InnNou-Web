import { z } from "zod";

export const createUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    userName: z.string().min(1, "Username is required"),
    password: z.string().min(5, "Min 5 characters"),
});

export const updateUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    userName: z.string().min(1, "Username is required"),

    password: z.string().optional(),

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