import { FormBody, FormDisplay } from "@inato-form/core";
import { Checkbox } from "@inato-form/fields";
import { Effect, pipe } from "effect";

import * as Mantine from "@mantine/core";
import { reportError, simulateSubmit } from "./utils";
import { MantineReactHookFormLive } from "./layer";

const body = FormBody.struct({
  disclaimer: Checkbox.Default,
  areYouSure: Checkbox.Default,
});

const Display = pipe(
  FormDisplay.make(body),
  Effect.provide(MantineReactHookFormLive),
  Effect.runSync
);

const Disclaimers = () => {
  // useControls must be called under the top level `Display.Form`
  const { watch: watchDisclaimer } = Display.disclaimer.useControls();
  const { watch: watchAreYouSure, reset: resetAreYouSure } =
    Display.areYouSure.useControls();

  const disclaimer = watchDisclaimer();
  const areYouSure = watchAreYouSure();

  const onChangeDisclaimer = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked && areYouSure) {
      resetAreYouSure();
    }
  };

  return (
    <>
      <Display.disclaimer
        label="Do you agree with the terms and conditions?"
        onChange={onChangeDisclaimer}
      />
      {disclaimer && <Display.areYouSure label="Are you sure??" />}
    </>
  );
};

export default function Conditional() {
  return (
    <Display.Form
      onSubmit={({ encoded }) => simulateSubmit(encoded)}
      onError={reportError}
    >
      <Mantine.Stack>
        <p>
          The information provided on this website is for general informational
          purposes only. All content is accurate to the best of our knowledge at
          the time of publication, but we make no representations or warranties
          regarding the completeness, reliability, or accuracy of the
          information. Any action you take based on the information provided is
          strictly at your own risk. We are not liable for any losses, damages,
          or inconvenience caused by reliance on the information contained in
          this website.
          <br />
          <br />
          All external links provided are for convenience, and we do not endorse
          or take responsibility for the content of any linked websites.
          <br />
          <br />
          Please consult a professional for advice tailored to your specific
          needs.
        </p>
        <Disclaimers />
        <Mantine.Group justify="end">
          <Display.Clear>clear</Display.Clear>
          <Display.Submit>submit</Display.Submit>
        </Mantine.Group>
      </Mantine.Stack>
    </Display.Form>
  );
}
