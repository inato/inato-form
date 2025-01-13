import { FormBody, FormDisplay } from "@inato-form/core";
import { TextInput } from "@inato-form/fields";
import { ReactHookForm } from "@inato-form/react-hook-form";
import { Effect, Layer, pipe } from "effect";
import * as Mantine from "@mantine/core";

const MantineLive = pipe(
  TextInput.layer(Mantine.TextInput),
  Layer.provideMerge(ReactHookForm.layer(Mantine.Button))
);

const body = FormBody.struct({ text: TextInput.Required });
const Display = pipe(
  FormDisplay.make(body),
  Effect.provide(MantineLive),
  Effect.runSync
);

export default function Simple() {
  return (
    <div>
      <Display.Form
        onSubmit={({ encoded }) => {
          console.log(encoded);
        }}
        onError={(e) => console.log(e)}
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
