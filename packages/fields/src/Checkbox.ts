import { FormField } from "@inato-form/core"
import { Schema } from "effect"

export interface CheckboxFC extends
  React.FC<{
    label?: React.ReactNode
    className?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
  }>
{}

export class Checkbox extends FormField.FormField("@inato-form/fields/Checkbox")<Checkbox, CheckboxFC>() {
  static Default = this.make({ schema: Schema.Boolean, defaultValue: false })
}
