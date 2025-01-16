import { FormField } from "@inato-form/core"
import type { Array } from "effect"
import { Schema } from "effect"

interface RadioGroupFC<Value extends string = string> extends
  React.FC<{
    label?: React.ReactNode
    placeholder?: string | undefined
    className?: string
    options: ReadonlyArray<{ label: React.ReactNode; value: Value }>
  }>
{}

export class RadioGroup extends FormField.FormField(
  "@inato-form/fields/RadioGroup"
)<RadioGroup, RadioGroupFC>() {
  static Required = <Literals extends Array.NonEmptyReadonlyArray<string>>(
    ...literals: Literals
  ) =>
    this.makeRequired({
      schema: Schema.Literal(...literals)
    }).decorate<RadioGroupFC<Literals[number]>>()

  static Optional = <Literals extends Array.NonEmptyReadonlyArray<string>>(
    ...literals: Literals
  ) =>
    this.make({
      schema: Schema.OptionFromNullOr(Schema.Literal(...literals)),
      defaultValue: null
    }).decorate<RadioGroupFC<Literals[number]>>()
}
