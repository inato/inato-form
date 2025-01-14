import { FormField } from "@inato-form/core"
import type { Array } from "effect"
import { Schema } from "effect"

interface SelectFC<Value extends string = string> extends
  React.FC<{
    label?: React.ReactNode
    placeholder?: string
    className?: string
    options: ReadonlyArray<{ label: string; value: Value }>
  }>
{}

export class Select extends FormField.FormField("@inato-form/fields/Select")<
  Select,
  SelectFC
>() {
  static RequiredWithLiterals = <
    Literals extends Array.NonEmptyReadonlyArray<string>
  >(
    ...literals: Literals
  ) =>
    this.makeRequired({
      schema: Schema.Literal(...literals)
    }).decorate<SelectFC<Literals[number]>>()

  static OptionalWithLiterals = <
    Literals extends Array.NonEmptyReadonlyArray<string>
  >(
    ...literals: Literals
  ) =>
    this.make({
      schema: Schema.OptionFromNullOr(Schema.Literal(...literals)),
      defaultValue: null
    }).decorate<SelectFC<Literals[number]>>()

  static Required = this.makeRequired({
    schema: Schema.String
  })

  static Optional = this.make({
    schema: Schema.OptionFromNullOr(Schema.String),
    defaultValue: null
  })
}
