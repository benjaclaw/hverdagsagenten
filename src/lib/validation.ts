import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
  password: z.string().min(6, "Passord må være minst 6 tegn"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Ugyldig e-postadresse"),
    password: z.string().min(6, "Passord må være minst 6 tegn"),
    confirmPassword: z.string().min(6, "Bekreft passordet"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passordene matcher ikke",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
