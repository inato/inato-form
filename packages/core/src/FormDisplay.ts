import type { Context, Types } from "effect"
import { Effect, Function, Option } from "effect"

import * as FormBody from "./FormBody.js"
import type * as FormField from "./FormField.js"
import * as FormFramework from "./FormFramework.js"
import { Path } from "./Path.js"

interface ArrayDisplay<Field extends FormBody.AnyArray> extends FormFramework.MakeIterable<Field> {
  Element: AnyFieldDisplay<Field["field"]>
}

interface MapDisplay<Field extends FormBody.AnyMap> extends FormFramework.MakeIterable<Field> {
  Element:
    & AnyFieldDisplay<Field["field"]>
    & FormFramework.MakeMapKey<Field["keySchema"]>
}

type RawDisplay<Field extends FormBody.AnyRaw> = FormFramework.MakeRaw<Field>

type FieldDisplay<Field extends FormField.Any> =
  & ReturnType<
    Context.Tag.Service<Field["tag"]>
  >
  & {
    useControls: () => FormFramework.FieldControls<Field>
  }

type FormDisplay<Body extends FormBody.Any> =
  & {
    [key in keyof Body["fields"]]: AnyFieldDisplay<
      Body["fields"][key]
    >
  }
  & {
    useControls: () => FormFramework.FieldControls<Body>
  }

type AnyFieldDependencies<Field extends FormBody.AnyField> = Field extends FormField.Any ? Field["tag"]
  : Field extends FormBody.Any ? FormDisplayDependenciesTag<Field>
  : Field extends FormBody.AnyIterable ? AnyFieldDependencies<Field["field"]>
  : never

type FormDisplayDependenciesTag<Body extends FormBody.Any> = {
  [key in keyof Body["fields"]]: AnyFieldDependencies<Body["fields"][key]>
}[keyof Body["fields"]]

type FormDisplayDependencies<Body extends FormBody.Any> = Context.Tag.Identifier<FormDisplayDependenciesTag<Body>>

const addControls = <T>(component: T, path: Path) =>
  Effect.gen(function*() {
    const { makeFieldControls } = yield* FormFramework.FormFramework
    // @ts-expect-error "'T' could be instantiated with an arbitrary type"
    const res: T & {
      useControls: () => FormFramework.FieldControls
    } = Object.assign(
      // @ts-expect-error "Argument of type 'T' is not assignable to parameter of type 'object'"
      component,
      makeFieldControls(path)
    )
    return res
  })

const makeField = (field: FormField.Any, path: Path) => {
  return Effect.gen(function*() {
    const builder = yield* field.tag
    const component = builder({ path })
    return yield* addControls(component, path)
  })
}

const makeImpl = <Body extends FormBody.Any>(
  body: Body,
  path: Path = Path.empty
): Effect.Effect<
  Types.Simplify<FormDisplay<Body>>,
  never,
  FormDisplayDependencies<Body>
> => {
  return Effect.gen(function*() {
    const framework = yield* FormFramework.FormFramework
    // @ts-expect-error "{} is incompatible with the desired type"
    const display: Types.Simplify<FormDisplay<Body>> = {}
    for (const [key, fieldValue] of Object.entries(body.fields)) {
      const currentPath = path.appendString(key)
      if (FormBody.isFormStruct(fieldValue)) {
        // @ts-expect-error "key does not exist in display"
        display[key] = yield* makeImpl(fieldValue, currentPath)
      } else if (
        FormBody.isFormArray(fieldValue) ||
        FormBody.isFormMap(fieldValue)
      ) {
        const { field } = fieldValue
        const defaultValue = "getDefaultValue" in field
          ? Option.getOrUndefined(field.getDefaultValue())
          : field.defaultValue
        const fieldArray = framework.makeIterable(defaultValue, currentPath)
        const pathWithIndex = FormBody.isFormMap(fieldValue)
          ? currentPath.appendIndex().appendString("1")
          : currentPath.appendIndex()
        const Element = FormBody.isFormStruct(field)
          ? yield* makeImpl(field, pathWithIndex)
          : yield* makeField(field, pathWithIndex)
        Object.assign(fieldArray, {
          Element
        })
        if (FormBody.isFormMap(fieldValue)) {
          Object.assign(
            Element,
            framework.makeMapKey(
              fieldValue.keySchema,
              currentPath.appendIndex().appendString("0")
            )
          )
        }
        // @ts-expect-error "key does not exist in display"
        display[key] = fieldArray
      } else if (FormBody.isFormRaw(fieldValue)) {
        // @ts-expect-error "key does not exist in display"
        display[key] = framework.makeRaw(currentPath)
      } else {
        // @ts-expect-error "key does not exist in display"
        display[key] = yield* makeField(fieldValue, currentPath)
      }
    }
    return yield* addControls(display, path)
  })
}

export type AnyFieldDisplay<Field extends FormBody.AnyField> = Field extends FormField.Any ? FieldDisplay<Field>
  : Field extends FormBody.Any ? Types.Simplify<FormDisplay<Field>>
  : Field extends FormBody.AnyArray ? ArrayDisplay<Field>
  : Field extends FormBody.AnyMap ? MapDisplay<Field>
  : Field extends FormBody.AnyRaw ? RawDisplay<Field>
  : never

// we must add & {} in the type so that Object.assign works correctly
const makeObjectAssignable = <T>(value: T) => Function.unsafeCoerce<T, T & {}>(value)

export const make = <Body extends FormBody.Any>(body: Body) => {
  return Effect.gen(function*() {
    const display = makeObjectAssignable(yield* makeImpl(body))
    const framework = yield* FormFramework.FormFramework
    const Form: FormFramework.FormComponent<Body["schema"]> = framework.makeForm({
      schema: body.schema,
      resetValues: body.defaultValue
    })
    const Submit = framework.makeSubmit(Form.id)
    const Clear = framework.Clear
    return Object.assign(display, { Form, Submit, Clear })
  })
}
