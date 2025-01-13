import { FormBody, FormDisplay, FormFramework } from "@inato-form/core";
import { TextInput } from "@inato-form/fields";
import { ReactHookForm } from "@inato-form/react-hook-form";
import { Effect, Layer, pipe } from "effect";
import * as Mantine from "@mantine/core";

const ButtonLive = Layer.sync(FormFramework.Button, () => ({
  Button: Mantine.Button,
}));

const body = FormBody.struct({ text: TextInput.Optional });
const Display = pipe(
  FormDisplay.make(body),
  Effect.provide(TextInput.Live),
  Effect.provide(ReactHookForm.Live),
  Effect.provide(ButtonLive),
  Effect.runSync
);

export default function Simple() {
  return (
    <div>
      <Display.Form
        onSubmit={({ encoded }) => {
          console.log(encoded);
        }}
        validationMode="onSubmit"
      >
        <Display.text
          // @ts-expect-error
          label="text"
        />
        <Display.Clear>clear</Display.Clear>
        <Display.Submit>submit</Display.Submit>
      </Display.Form>
    </div>
  );
}
