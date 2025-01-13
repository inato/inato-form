import { FormField, FormFramework } from "@inato-form/core"
import { Schema } from "effect"

export type TextInputFC = React.FC

export class TextInput extends FormField.FormField("@inato-form/fields/TextInput")<TextInput, TextInputFC>() {
  static Optional = this.make({
    schema: Schema.OptionFromNonEmptyTrimmedString,
    defaultValue: ""
  })
  static Required = this.makeRequired({
    schema: Schema.Trim.pipe(Schema.nonEmptyString())
  })

  static layer = (TextInput: TextInputFC) =>
    this.layerBuilder(
      FormFramework.FormFramework.use(({ register }) => ({ path }) => register(TextInput, path))
    )
}
