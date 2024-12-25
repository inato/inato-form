import { Effect, Either, ParseResult, Predicate, Schema } from "effect"
import type React from "react"
import type { FieldPath } from "react-hook-form"

import type * as FormBody from "./FormBody.js"
import type { Path } from "./Path.js"

type Values<S extends Schema.Schema.AnyNoContext> =
  | {
    encoded: S["Encoded"] | ((from: S["Encoded"]) => S["Encoded"])
  }
  | { unknown: unknown }

const getValues = <S extends Schema.Schema.AnyNoContext>(schema: S) =>
({
  defaultValues,
  values
}: {
  values: Values<NoInfer<S>> | undefined
  defaultValues: NoInfer<S>["Encoded"]
}): S["Encoded"] => {
  if (!values) return defaultValues
  if ("encoded" in values) {
    if (Predicate.isFunction(values.encoded)) {
      return values.encoded(defaultValues)
    } else {
      return values.encoded
    }
  } else {
    const encodedSchema = Schema.encodedSchema(schema)
    const either = Schema.decodeUnknownEither(encodedSchema, {
      errors: "all"
    })(values.unknown)
    if (Either.isRight(either)) {
      return either.right
    } else {
      // TODO: use effect log

      console.log(
        "[warning] Provided values are not valid. Falling back on default values",
        ParseResult.ArrayFormatter.formatErrorSync(either.left)
      )
      return defaultValues
    }
  }
}

export class FormFramework extends Effect.Tag("@inato/Form/FormFramework")<
  FormFramework,
  IFormFramework
>() {
  static getValues = getValues
}

export interface FormComponentProps<S extends Schema.Schema.AnyNoContext> {
  children: React.ReactNode
  onSubmit: (_: {
    decoded: S["Type"]
    encoded: S["Encoded"]
  }) => void | Promise<void>
  onError?: (values: unknown) => void
  /**
   * The validation mode. Default: 'onBlur'
   */
  validationMode?: "onBlur" | "onSubmit" | "onChange"
  /**
   * The values to hydrate the form with, typically loading some values already saved by the user
   */
  initialValues?: Values<S>
  /**
   * The starting point of an empty form
   */
  resetValues?: Values<S>
}
export interface FormComponent<S extends Schema.Schema.AnyNoContext> extends React.FC<FormComponentProps<S>> {
  /**
   * The form id to synchronize with Submit button
   */
  id: string
}

export type ReactFCWithChildren = React.FC<{
  children: React.ReactNode
}>

export interface FieldControls<
  Field extends FormBody.AnyField = FormBody.AnyField
> {
  watch: () => Field["schema"]["Encoded"]
  reset: () => void
  set: (value: Field["schema"]["Encoded"]) => void
}

export interface ArrayControls<
  Field extends FormBody.AnyArray = FormBody.AnyArray
> extends FieldControls<Field> {
  append: (value?: Field["field"]["schema"]["Encoded"]) => void
  useRemove: () => { remove: () => void }
}

export interface MakeIterable<
  Field extends FormBody.AnyIterable = FormBody.AnyIterable
> extends ReactFCWithChildren {
  Fields: ReactFCWithChildren
  useControls: () => Field extends FormBody.AnyArray ? ArrayControls<Field>
    : FieldControls<Field>
}

export interface RawControls<Field extends FormBody.AnyRaw = FormBody.AnyRaw> extends FieldControls<Field> {
  usePath: <T extends FieldPath<Field["schema"]["Encoded"]>>(
    path: T
  ) => string
}

export interface MakeRaw<Field extends FormBody.AnyRaw = FormBody.AnyRaw> extends ReactFCWithChildren {
  useControls: () => RawControls<Field>
}

export interface MakeMapKey<S extends Schema.Schema.AnyNoContext> {
  Key: React.FC
  useKey: () => S["Encoded"]
}

export type Button = React.FC<
  {
    type?: "submit" | "reset" | "button"
    form?: string
    variant?: string
    loading?: boolean
    children?: React.ReactNode
    onClick?: React.MouseEventHandler
  }
>

export interface IFormFramework {
  register: <A>(component: React.FC<A>, path: Path) => React.FC<A>

  makeFieldControls: (path: Path) => {
    useControls: () => FieldControls
  }

  makeIterable: (
    defaultValue: unknown,
    path: Path
  ) => MakeIterable<FormBody.AnyArray>

  makeMapKey: <S extends Schema.Schema.AnyNoContext>(
    schema: S,
    path: Path
  ) => MakeMapKey<S>

  makeRaw: (path: Path) => MakeRaw

  makeForm: <S extends Schema.Schema.AnyNoContext>(_: {
    schema: S
    resetValues: S["Encoded"]
  }) => FormComponent<S>

  makeSubmit: (formId: string) => Button

  useError: <T = unknown>(path: Path) => T

  Clear: Button
}
