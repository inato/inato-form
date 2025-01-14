import { FormBody, FormDisplay } from "@inato-form/core";
import { NumberInput, TextArea, TextInput } from "@inato-form/fields";
import { ReactHookForm } from "@inato-form/react-hook-form";
import { Effect, Layer, Logger, pipe } from "effect";
import * as Mantine from "@mantine/core";

const MantineLive = pipe(
  Layer.mergeAll(
    TextInput.layerUncontrolled(Mantine.TextInput),
    TextArea.layerUncontrolled(Mantine.Textarea),
    NumberInput.layerControlled(Mantine.NumberInput),
    TextArea.layerUncontrolled(Mantine.Textarea)
  ),
  Layer.provideMerge(ReactHookForm.layer(Mantine.Button))
);

const body = FormBody.struct({
  text: TextInput.Required,
  textarea: TextArea.Required,
  number: NumberInput.Optional,
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
          <Mantine.Group justify="end">
            <Display.Clear>clear</Display.Clear>
            <Display.Submit>submit</Display.Submit>
          </Mantine.Group>
        </Mantine.Stack>
      </Display.Form>
    </Mantine.Container>
  );
}
