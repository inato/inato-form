import { FormBody, FormDisplay } from "@inato-form/core";
import {
  MultiSelect,
  NumberInput,
  RadioGroup,
  Select,
  TextArea,
  TextInput,
} from "@inato-form/fields";
import { ReactHookForm } from "@inato-form/react-hook-form";
import { Effect, Layer, Logger, pipe } from "effect";
import * as Mantine from "@mantine/core";

const MantineLive = pipe(
  Layer.mergeAll(
    TextInput.layerUncontrolled(Mantine.TextInput),
    TextArea.layerUncontrolled(Mantine.Textarea),
    NumberInput.layerControlled(Mantine.NumberInput),
    TextArea.layerUncontrolled(Mantine.Textarea),
    Select.layerControlled(({ options, ...props }) => (
      <Mantine.Select {...props} data={options} />
    )),
    MultiSelect.layerControlled(({ options, ...props }) => (
      <Mantine.MultiSelect {...props} data={options} />
    )),
    RadioGroup.layerControlled(({ options, ...props }) => (
      <Mantine.Radio.Group {...props}>
        <Mantine.Group mt="xs">
          {options.map((props) => (
            <Mantine.Radio key={props.value} {...props} />
          ))}
        </Mantine.Group>
      </Mantine.Radio.Group>
    ))
  ),
  Layer.provideMerge(ReactHookForm.layer(Mantine.Button))
);

const body = FormBody.struct({
  text: TextInput.Required,
  textarea: TextArea.Required,
  number: NumberInput.Required,
  select: Select.RequiredWithLiterals("foo", "bar"),
  multiselect: MultiSelect.Default("foo", "bar"),
  radiogroup: RadioGroup.Required("react", "svelte", "ng", "vue"),
});
const Display = pipe(
  FormDisplay.make(body),
  Effect.provide(MantineLive),
  Effect.runSync
);

const simulateSubmit = (values: unknown) =>
  pipe(
    Effect.log("submitting", { values }),
    Effect.andThen(Effect.sleep(1000)),
    Effect.provide(Logger.pretty),
    Effect.runPromise
  );

export default function Simple() {
  return (
    <Mantine.Container mt="lg" maw={500}>
      <Mantine.Title>Simple form</Mantine.Title>
      <Display.Form
        onSubmit={({ encoded }) => simulateSubmit(encoded)}
        onError={(e) => console.log(e)}
        validationMode="onSubmit"
      >
        <Mantine.Stack>
          <Display.text label="text" placeholder="type something here..." />
          <Display.textarea label="textarea" />
          <Display.number label="number" />
          <Display.select
            label="select"
            placeholder="select one option"
            options={[
              { label: "Foo", value: "foo" },
              { label: "Bar", value: "bar" },
            ]}
          />
          <Display.multiselect
            label="multiselect"
            placeholder="select one or more option"
            options={[
              { label: "Foo", value: "foo" },
              { label: "Bar", value: "bar" },
            ]}
          />
          <Display.radiogroup
            label="radiogroup"
            options={[
              { label: "React", value: "react" },
              { label: "Svelte", value: "svelte" },
              { label: "Angular", value: "ng" },
              { label: "Vue", value: "vue" },
            ]}
          />
          <Mantine.Group justify="end">
            <Display.Clear>clear</Display.Clear>
            <Display.Submit>submit</Display.Submit>
          </Mantine.Group>
        </Mantine.Stack>
      </Display.Form>
    </Mantine.Container>
  );
}
