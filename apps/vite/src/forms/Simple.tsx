import { FormBody, FormDisplay } from "@inato-form/core";
import {
  Checkbox,
  CheckboxGroup,
  MultiSelect,
  NumberInput,
  RadioGroup,
  Select,
  TextArea,
  TextInput,
} from "@inato-form/fields";
import { Effect, pipe } from "effect";
import * as Mantine from "@mantine/core";
import { reportError, simulateSubmit } from "./utils";
import { MantineReactHookFormLive } from "./layer";

const body = FormBody.struct({
  nested: FormBody.struct({
    text: TextInput.Required,
    textarea: TextArea.Required,
  }),
  number: NumberInput.Optional,
  select: Select.OptionalWithLiterals("react", "svelte", "ng", "vue"),
  multiselect: MultiSelect.Default("react", "svelte", "ng", "vue"),
  radiogroup: RadioGroup.Optional("react", "svelte", "ng", "vue"),
  checkbox: Checkbox.Default,
  checkboxgroup: CheckboxGroup.Default("react", "svelte", "ng", "vue"),
});

const Display = pipe(
  FormDisplay.make(body),
  Effect.provide(MantineReactHookFormLive),
  Effect.runSync
);

const options = [
  { label: "React", value: "react" },
  { label: "Svelte", value: "svelte" },
  { label: "Angular", value: "ng" },
  { label: "Vue", value: "vue" },
] as const;

export default function Simple() {
  return (
    <Display.Form
      onSubmit={({ encoded }) => simulateSubmit(encoded)}
      onError={reportError}
      validationMode="onSubmit"
    >
      <Mantine.Stack>
        <Display.nested.text
          label="text"
          placeholder="type something here..."
        />
        <Display.nested.textarea label="textarea" />
        <Display.number label="number" />
        <Display.checkbox label="checkbox" />
        <Display.select
          label="select"
          placeholder="select one option"
          options={options}
        />
        <Display.multiselect
          label="multiselect"
          placeholder="select one or more option"
          options={options}
        />
        <Display.radiogroup label="radiogroup" options={options} />
        <Display.checkboxgroup label="checkboxgroup" options={options} />
        <Mantine.Group justify="end">
          <Display.Clear>clear</Display.Clear>
          <Display.Submit>submit</Display.Submit>
        </Mantine.Group>
      </Mantine.Stack>
    </Display.Form>
  );
}
