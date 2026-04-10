import { z } from "zod";

export const buildCreateUserSchema = (t: (key: string) => string) =>
    z.object({
        firstName: z.string().min(1, t("users.validation.firstNameRequired")),
        lastName: z.string().min(1, t("users.validation.lastNameRequired")),
        email: z.string().email(t("users.validation.emailInvalid")),
        userName: z.string().min(1, t("users.validation.usernameRequired")),
        password: z.string()
            .min(8, t("users.validation.passwordMin"))
            .regex(/[A-Z]/, t("users.validation.passwordUpper"))
            .regex(/[a-z]/, t("users.validation.passwordLower"))
            .regex(/[0-9]/, t("users.validation.passwordNumber"))
            .regex(/[^A-Za-z0-9]/, t("users.validation.passwordSpecial")),
    });

export const buildUpdateUserSchema = (t: (key: string) => string) =>
    z.object({
        firstName: z.string().min(1, t("users.validation.firstNameRequired")),
        lastName: z.string().min(1, t("users.validation.lastNameRequired")),
        email: z.string().email(t("users.validation.emailInvalid")),
        userName: z.string().min(1, t("users.validation.usernameRequired")),

        password: z.string()
            .min(8, t("users.validation.passwordMin"))
            .regex(/[A-Z]/, t("users.validation.passwordUpper"))
            .regex(/[a-z]/, t("users.validation.passwordLower"))
            .regex(/[0-9]/, t("users.validation.passwordNumber"))
            .regex(/[^A-Za-z0-9]/, t("users.validation.passwordSpecial"))
            .optional(),

        changePassword: z.boolean()
    })
        .superRefine((data, ctx) => {
            if (data.changePassword) {
                if (!data.password || data.password.length < 5) {
                    ctx.addIssue({
                        path: ["password"],
                        code: z.ZodIssueCode.custom,
                        message: t("users.validation.passwordMinShort"),
                    });
                }
            }
        });

//export type CreateUserForm = z.infer<typeof createUserSchema>;