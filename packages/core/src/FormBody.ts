import type { Types } from "effect"
import { Predicate, Schema, Tuple } from "effect"

import type * as FormField from "./FormField.js"

type FormSchemaFields<Fields extends AnyFields> = Types.Simplify<
  {
    [key in keyof Fields]: Fields[key] extends Any ? FormSchema<Fields[key]["fields"]>
      : Fields[key]["schema"]
  }
>

type FormSchemaStruct<T> = T extends Schema.Struct.Fields ? Schema.Struct<T>
  : never

type FormSchema<Fields extends AnyFields> = FormSchemaStruct<
  FormSchemaFields<Fields>
>

export const FormStructTypeId = Symbol.for("@inato/Form/FormBody/FormStruct")
export type FormStructTypeId = typeof FormStructTypeId

export const isFormStruct = (
  value: unknown
): value is FormStruct<AnyFields> => Predicate.hasProperty(value, FormStructTypeId)

interface FormStruct<Fields extends AnyFields> {
  [FormStructTypeId]: FormStructTypeId
  fields: Fields
  schema: FormSchema<Fields>
  defaultValue: FormSchema<Fields>["Encoded"]
}

export const FormArrayTypeId = Symbol.for("@inato/Form/FormBody/FormArray")
export type FormArrayTypeId = typeof FormArrayTypeId

export const isFormArray = (value: unknown): value is AnyArray => Predicate.hasProperty(value, FormArrayTypeId)

interface FormArray<Field extends AnyNonIterableField> {
  [FormArrayTypeId]: FormArrayTypeId
  field: Field
  schema: Schema.Array$<Field["schema"]>
  defaultValue: FormArray<Field>["schema"]["Encoded"]
}

export const FormMapTypeId = Symbol.for("@inato/Form/FormBody/FormMap")
export type FormMapTypeId = typeof FormMapTypeId

export const isFormMap = (value: unknown): value is AnyMap => Predicate.hasProperty(value, FormMapTypeId)

interface FormMap<
  Key extends Schema.Schema.AnyNoContext,
  Field extends AnyNonIterableField
> {
  [FormMapTypeId]: FormMapTypeId
  field: Field
  keySchema: Key
  schema: Schema.HashMap<Key, Field["schema"]>
  defaultValue: FormMap<Key, Field>["schema"]["Encoded"]
  defaultValueFor: (
    keys: ReadonlyArray<Key["Encoded"]>
  ) => FormMap<Key, Field>["defaultValue"]
}

export const FormRawTypeId = Symbol.for("@inato/Form/FormBody/FormRaw")
export type FormRawTypeId = typeof FormRawTypeId

export const isFormRaw = (value: unknown): value is AnyRaw => Predicate.hasProperty(value, FormRawTypeId)

interface FormRaw<S extends Schema.Schema.AnyNoContext> {
  [FormRawTypeId]: FormRawTypeId
  schema: S
  defaultValue: S["Encoded"]
}

const makeStructSchema = <Fields extends AnyFields>(
  fields: Fields
): {
  schema: FormSchema<Fields>
  defaultValue: FormSchema<Fields>["Encoded"]
} => {
  const schemaFields: Types.Mutable<Schema.Struct.Fields> = {}
  const defaultValue: Record<string, unknown> = {}
  for (const [key, field] of Object.entries(fields)) {
    schemaFields[key] = field.schema
    if ("matchDefaultValue" in field) {
      field.matchDefaultValue({
        withDefaultValue: (value) => {
          defaultValue[key] = value
        }
      })
    } else {
      defaultValue[key] = field.defaultValue
    }
  }
  // @ts-expect-error "structSchema is indeed of type FormSchema<Fields>"
  const structSchema: FormSchema<Fields> = Schema.Struct(schemaFields)
  return { schema: structSchema, defaultValue }
}

export const struct = <Fields extends AnyFields>(
  fields: Fields
): FormStruct<Fields> => {
  const { defaultValue, schema } = makeStructSchema(fields)
  return { [FormStructTypeId]: FormStructTypeId, fields, schema, defaultValue }
}

export const array = <Field extends AnyNonIterableField>(
  field: Field
): FormArray<Field> => {
  return {
    [FormArrayTypeId]: FormArrayTypeId,
    field,
    schema: Schema.Array(field.schema),
    defaultValue: []
  }
}

export const map = <A, I, Field extends AnyNonIterableField>({
  field,
  key
}: {
  key: Schema.Schema<A, I>
  field: Field
}): FormMap<Schema.Schema<A, I>, Field> => {
  return {
    [FormMapTypeId]: FormMapTypeId,
    field,
    keySchema: key,
    schema: Schema.HashMap({ key, value: field.schema }),
    defaultValue: [],
    defaultValueFor(keys) {
      const defaultValue: typeof field.schema.Encoded = "getDefaultValue" in field
        ? field.getDefaultValue()
        : field.defaultValue
      return keys.map((key) => Tuple.make(key, defaultValue))
    }
  }
}

export const raw = <S extends Schema.Schema.AnyNoContext>({
  defaultValue,
  schema
}: {
  schema: S
  defaultValue: S["Encoded"]
}): FormRaw<S> => {
  return {
    [FormRawTypeId]: FormRawTypeId,
    schema,
    defaultValue
  }
}

export type AnyNonIterableField = Any | FormField.Any

export type AnyArray = FormArray<AnyNonIterableField>

export type AnyMap = FormMap<Schema.Schema.AnyNoContext, AnyNonIterableField>

export type AnyRaw = FormRaw<Schema.Schema.AnyNoContext>

export type AnyIterable =
  | FormArray<AnyNonIterableField>
  | FormMap<Schema.Schema.AnyNoContext, AnyNonIterableField>

export type AnyField = AnyNonIterableField | AnyIterable | AnyRaw

export type AnyFields = Record<string, AnyField>

export type Any = FormStruct<AnyFields>
