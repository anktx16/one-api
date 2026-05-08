import { t } from "elysia";

export namespace PaymentsModel {
    export const onrampResponseSchema = t.Object({
        message: t.Literal("onramp successfull"),
        credits: t.Number()
    })

    export type onrampResponseSchema = typeof onrampResponseSchema.static

    export const onrampFailedResponseSchema = t.Object({
        message: t.Literal("onramp failed")
    })

    export type onrampFailedResponseSchema = typeof onrampFailedResponseSchema.static
}