/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
import { FormField } from "@inato-form/core"
import { Schema } from "effect"

export interface TextInputFC extends
  React.FC<{
    label?: React.ReactNode
    placeholder?: string | undefined | undefined
    className?: string
  }>
{}

const EMAIL_REGEX = new RegExp( // Same regexpackages/codec/src/email.test.ts as used in Yup source code: https://github.com/jquense/yup/blob/acbb8b4f3c24ceaf65eab09abaf8e086a9f11a73/src/string.ts#L9
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
)

const emailSchema = Schema.pattern(EMAIL_REGEX, {
  message: () => ({ message: `Not a valid email address`, override: true })
})(
  Schema.String
)

export class TextInput extends FormField.FormField("@inato-form/fields/TextInput")<TextInput, TextInputFC>() {
  static Optional = this.make({
    schema: Schema.OptionFromNonEmptyTrimmedString,
    defaultValue: ""
  })
  static Required = this.makeRequired({
    schema: Schema.Trim.pipe(Schema.nonEmptyString())
  })
  static Email = {
    Optional: this.make({
      schema: Schema.OptionFromNullOr(emailSchema),
      defaultValue: null
    }),
    Required: this.makeRequired({
      schema: emailSchema
    })
  }
}
