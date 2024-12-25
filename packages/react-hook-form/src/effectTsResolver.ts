import { toNestErrors, validateFieldsNatively } from "@hookform/resolvers"
import { Effect, ParseResult, Schema } from "effect"
import type { ParseOptions } from "effect/SchemaAST"
import type * as RHF from "react-hook-form"

// remove once this has been merged and released:
// https://github.com/react-hook-form/resolvers/pull/720
export const effectTsResolver = <A extends RHF.FieldValues, I, TContext>(
  schema: Schema.Schema<A, I>,
  config: ParseOptions = { errors: "all", onExcessProperty: "ignore" }
) =>
(
  values: RHF.FieldValues,
  _: TContext | undefined,
  options: RHF.ResolverOptions<A>
): Promise<RHF.ResolverResult<A>> => {
  return Schema.decodeUnknown(
    schema,
    config
  )(values).pipe(
    Effect.catchAll((parseIssue) => Effect.flip(ParseResult.ArrayFormatter.formatError(parseIssue))),
    Effect.mapError((issues) => {
      const errors = issues.reduce((acc, current) => {
        const key = current.path.join(".")
        acc[key] = { message: current.message, type: current._tag }
        return acc
      }, {} as RHF.FieldErrors)

      return toNestErrors(errors, options)
    }),
    Effect.tap(() =>
      Effect.sync(
        () =>
          options.shouldUseNativeValidation &&
          validateFieldsNatively({}, options)
      )
    ),
    Effect.match({
      onFailure: (errors) => ({ errors, values: {} }),
      onSuccess: (result) => ({ errors: {}, values: result })
    }),
    Effect.runPromise
  )
}
