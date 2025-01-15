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
  text: TextInput.Required,
  textarea: TextArea.Required,
  number: NumberInput.Required,
  select: Select.RequiredWithLiterals("foo", "bar"),
  multiselect: MultiSelect.Default("foo", "bar"),
  radiogroup: RadioGroup.Required("react", "svelte", "ng", "vue"),
  checkbox: Checkbox.Default,
  checkboxgroup: CheckboxGroup.Default("react", "svelte", "ng", "vue"),
});

const Display = pipe(
  FormDisplay.make(body),
  Effect.provide(MantineReactHookFormLive),
  Effect.runSync
);

export default function Simple() {
  return (
    <Display.Form
      onSubmit={({ encoded }) => simulateSubmit(encoded)}
      onError={reportError}
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
        <Display.checkbox label="checkbox" />
        <Display.checkboxgroup
          label="checkboxgroup"
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
  );
}
