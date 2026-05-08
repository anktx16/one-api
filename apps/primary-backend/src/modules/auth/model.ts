import { t } from "elysia";

export namespace AuthModel {
    export const signInSchema = t.Object({
        email: t.String(),
        password: t.String()
    })

    export type signInSchema = typeof signInSchema.static

    export const signInResponseSchema = t.Object({
        message: t.Literal("signed in successfully")
    })

    export type signInResponseSchema = typeof signInResponseSchema.static

    export const signUpSchema = t.Object({
        email: t.String(),
        password: t.String()
    })

    export type signUpSchema = typeof signUpSchema.static

    export const signUpResponseSchema = t.Object({
        id: t.String()
    })

    export type signUpResponseSchema = typeof signUpResponseSchema.static

    export const signUpFailedResponseSchema = t.Object({
       message: t.Literal("Error while signing up")
    })

    export type signUpFailedResponseSchema = typeof signUpFailedResponseSchema.static

    export const signInFailedResponseSchema = t.Object({
        message: t.Literal("Invalid username or password")
    })

    export type signInFailedResponseSchema = typeof signInFailedResponseSchema.static

    export const profileResponseSchema = t.Object({
        credits: t.Number()
    })

    export type profileResponseSchema = typeof profileResponseSchema.static

    export const profileResponseFailedSchema = t.Object({
        message: t.Literal("error while fetching user details")
    })

    export type profileResponseFailedSchema = typeof profileResponseFailedSchema.static
}