import { FormBody, FormDisplay } from "@inato-form/core";
import { TextInput } from "@inato-form/fields";
import { ReactHookForm } from "@inato-form/react-hook-form";
import { Effect, pipe } from "effect";

const body = FormBody.struct({ text: TextInput.Optional });
const Display = pipe(
  FormDisplay.make(body),
  Effect.provide(TextInput.Live),
  Effect.provide(ReactHookForm.Live),
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
        <Display.text label="text" />
        <Display.Clear>clear</Display.Clear>
        <Display.Submit>submit</Display.Submit>
      </Display.Form>
    </div>
  );
}
