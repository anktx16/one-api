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

    export const signOutResponseSchema = t.Object({
        message: t.Literal("signed out successfully")
    })

    export type signOutResponseSchema = typeof signOutResponseSchema.static

    export const signOutFailedResponseSchema = t.Object({
        message: t.Literal("sign out failed")
    })

    export type signOutFailedResponseSchema = typeof signInFailedResponseSchema.static
    

    export const profileResponseSchema = t.Object({
        credits: t.Number()
    })

    export type profileResponseSchema = typeof profileResponseSchema.static

    export const profileResponseFailedSchema = t.Object({
        message: t.Literal("error while fetching user details")
    })

    export type profileResponseFailedSchema = typeof profileResponseFailedSchema.static


    export const rateLimitResponseSchema = t.Object({
        message: t.Literal("Too many attempts. Please try again later.")
    })

    export type rateLimitResponseSchema = typeof rateLimitResponseSchema.static
}