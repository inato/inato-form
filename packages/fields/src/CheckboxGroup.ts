import { FormField } from "@inato-form/core"
import type { Array } from "effect"
import { Schema } from "effect"

interface CheckboxGroupFC<Value extends string = string> extends
  React.FC<{
    label?: React.ReactNode
    className?: string
    options: ReadonlyArray<{ label: React.ReactNode; value: Value }>
  }>
{}

export class CheckboxGroup
  extends FormField.FormField("@inato-form/fields/CheckboxGroup")<CheckboxGroup, CheckboxGroupFC>()
{
  static Default = <Literals extends Array.NonEmptyReadonlyArray<string>>(
    ...literals: Literals
  ) =>
    this.make({
      schema: Schema.HashSet(Schema.Literal(...literals)),
      defaultValue: []
    }).decorate<CheckboxGroupFC<Literals[number]>>()
}
