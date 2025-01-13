import { Effect, Layer, Pretty, Schema } from "effect";
import React from "react";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import { FormFramework, Path } from "@inato-form/core";

import * as RHF from "react-hook-form";
import { makeContext } from "./makeContext.js";
import { effectTsResolver } from "./effectTsResolver.js";

// const Button: FormFramework.ButtonFC = (props) => <button {...props} />;

export const Live = Layer.effect(
  FormFramework.FormFramework,
  Effect.gen(function* () {
    const { Button } = yield* FormFramework.Button;

    const formFramework: FormFramework.IFormFramework = {
      register(Component, path) {
        return (props) => {
          const { register } = RHF.useFormContext();
          const name = Path.usePath(path);
          return <Component {...props} {...register(name)} />;
        };
      },
      makeFieldControls(path) {
        return {
          useControls() {
            const name = Path.usePath(path);
            const { reset, resetField, setValue, watch } = RHF.useFormContext();

            if (path.isEmpty) {
              return {
                reset: () => reset(),
                watch: () => watch(),
                set: () => {
                  throw new Error("Cannot set the whole form values at once");
                },
              };
            }

            return {
              reset: () => resetField(name),
              watch: () => watch(name),
              set: (value) => setValue(name, value),
            };
          },
        };
      },
      makeIterable(defaultValue, path) {
        interface ControlsContext extends FormFramework.ArrayControls {
          fields: ReadonlyArray<{ id: string }>;
        }
        const controlsContext = makeContext<ControlsContext>("ArrayControls");

        const Parent: FormFramework.ReactFCWithChildren = ({ children }) => {
          const name = Path.usePath(path);
          const { append, fields, remove } = RHF.useFieldArray({ name });
          const fieldControls = this.makeFieldControls(path);
          const controls: ControlsContext = {
            ...fieldControls.useControls(),
            fields,
            append: (value = defaultValue) => append(value),
            useRemove: () => {
              const index = Path.useIndex();
              return { remove: () => remove(index) };
            },
          };
          return (
            <controlsContext.Provider value={controls}>
              {children}
            </controlsContext.Provider>
          );
        };

        const Fields: FormFramework.ReactFCWithChildren = ({ children }) => {
          const { fields } = controlsContext.useContext();
          return fields.map((field, index) => (
            <Path.Provider key={field.id} index={index}>
              {children}
            </Path.Provider>
          ));
        };

        return Object.assign(Parent, {
          Fields,
          useControls: controlsContext.useContext,
        });
      },
      makeMapKey(schema, path) {
        const pretty = Pretty.make(schema);
        const useKey = () => {
          const { watch } = RHF.useFormContext();
          const name = Path.usePath(path);
          return watch(name);
        };
        const Key: React.FC = () => {
          const key = useKey();
          return pretty(key);
        };
        return { useKey, Key };
      },
      makeRaw(lhs) {
        const Component: FormFramework.ReactFCWithChildren = ({ children }) => {
          return children;
        };
        const controls = this.makeFieldControls(lhs);
        return Object.assign(Component, {
          useControls: () => {
            return {
              ...controls.useControls(),
              usePath: (rhs: string) => {
                const path = lhs.appendString(rhs);
                return Path.usePath(path);
              },
            };
          },
        });
      },
      makeForm({ schema, resetValues }) {
        const formId = uuidv4();
        const getValues_ = FormFramework.FormFramework.getValues(schema);
        const Form: React.FC<
          FormFramework.FormComponentProps<typeof schema>
        > = (props) => {
          const { children, onSubmit, onError } = props;
          const resetValues_ = useMemo(
            () =>
              getValues_({
                defaultValues: resetValues,
                values: props.resetValues,
              }),
            [props.resetValues]
          );
          const initialValues = useMemo(() => {
            if (props.initialValues) {
              return getValues_({
                values: props.initialValues,
                defaultValues: resetValues_,
              });
            }
            return undefined;
          }, [resetValues_, props.initialValues]);
          const formMethods = RHF.useForm<typeof schema.Type>({
            mode: props.validationMode ?? "onBlur",
            resolver: effectTsResolver(schema),
            defaultValues: resetValues_,
            values: initialValues,
            resetOptions: { keepDefaultValues: true },
          });

          return (
            <RHF.FormProvider {...formMethods}>
              <form
                id={formId}
                onSubmit={formMethods.handleSubmit(
                  (values) =>
                    onSubmit({
                      decoded: values,
                      encoded: Schema.encodeUnknownSync(schema)(values),
                    }),
                  onError
                )}
              >
                {children}
              </form>
            </RHF.FormProvider>
          );
        };
        return Object.assign(Form, { id: formId });
      },
      makeSubmit: (formId) => {
        const SubmitButton: FormFramework.ButtonFC = (props) => {
          const {
            formState: { isSubmitting },
          } = RHF.useFormContext();
          return (
            <Button
              {...props}
              type="submit"
              form={formId}
              loading={isSubmitting}
            >
              {props.children}
            </Button>
          );
        };
        return SubmitButton;
      },
      useError(path) {
        const {
          formState: { errors },
        } = RHF.useFormContext();
        const errorPath = Path.usePath(path);
        return RHF.get(errors, errorPath);
      },
      Clear: (props) => {
        const formMethods = RHF.useFormContext();
        return (
          <Button {...props} type="reset" onClick={() => formMethods.reset()}>
            {props.children}
          </Button>
        );
      },
    };

    return formFramework;
  })
);
