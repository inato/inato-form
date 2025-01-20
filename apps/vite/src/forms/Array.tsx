import { FormBody, FormDisplay } from "@inato-form/core";
import { MultiSelect, TextInput } from "@inato-form/fields";
import { Effect, pipe } from "effect";
import * as Mantine from "@mantine/core";
import { reportError, simulateSubmit } from "./utils";
import { MantineReactHookFormLive } from "./layer";

const body = FormBody.struct({
  users: FormBody.array(
    FormBody.struct({
      firstName: TextInput.Required,
      lastName: TextInput.Optional,
      email: TextInput.Email.Required,
      favorite: MultiSelect.Default("react", "svelte", "ng", "vue"),
    })
  ),
});

const display = pipe(
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

function UserInfo() {
  return (
    <>
      <display.users.Element.firstName label="First name" />
      <display.users.Element.lastName label="Last name" />
      <display.users.Element.email label="Email" />
    </>
  );
}

function UserPreferences() {
  const { watch } = display.users.Element.favorite.useControls();
  const favoriteValue = watch();
  const showMessage = favoriteValue.includes("ng");

  return (
    <>
      <display.users.Element.favorite
        label="Favorite framework"
        options={options}
      />
      {showMessage && <Mantine.Alert>Really? Still in 2025?</Mantine.Alert>}
    </>
  );
}

function AddUser() {
  const { append } = display.users.useControls();
  return <Mantine.Button onClick={() => append()}>new user</Mantine.Button>;
}

function RemoveUser() {
  const { useRemove } = display.users.useControls();
  const { remove } = useRemove();
  return (
    <Mantine.Button onClick={() => remove()} mt="sm">
      remove
    </Mantine.Button>
  );
}

export default function Simple() {
  return (
    <display.Form
      onSubmit={({ encoded }) => simulateSubmit(encoded)}
      onError={reportError}
      validationMode="onSubmit"
      initialValues={{
        encoded: {
          // initialize with 1 empty user
          users: [{ email: "", favorite: [], firstName: "", lastName: "" }],
        },
      }}
    >
      <Mantine.Stack>
        <display.users>
          <AddUser />
          <Mantine.Flex direction="column-reverse" gap="sm">
            <display.users.Fields>
              <Mantine.Fieldset>
                <UserInfo />
                <UserPreferences />
                <RemoveUser />
              </Mantine.Fieldset>
            </display.users.Fields>
          </Mantine.Flex>
        </display.users>
        <Mantine.Group justify="end">
          <display.Clear>clear</display.Clear>
          <display.Submit>submit</display.Submit>
        </Mantine.Group>
      </Mantine.Stack>
    </display.Form>
  );
}
