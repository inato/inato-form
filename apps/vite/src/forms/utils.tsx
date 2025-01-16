import { Container, Title } from "@mantine/core";
import { pipe, Effect, Logger } from "effect";

export interface FormExample extends React.FC {
  title: string;
  route: string;
}

export const makeFormExample = (
  Form: React.FC,
  { route, title }: { title: string; route: string }
): FormExample => {
  const FormExample = () => (
    <Container mt="lg" maw={500}>
      <Title>{title}</Title>
      <Form />
    </Container>
  );
  return Object.assign(FormExample, { title, route });
};

export const simulateSubmit = (values: unknown) =>
  pipe(
    Effect.log("submitting", { values }),
    Effect.andThen(Effect.sleep(1000)),
    Effect.provide(Logger.pretty),
    Effect.runPromise
  );

export const reportError = (error: unknown) =>
  pipe(
    Effect.log("failed to submit", { error }),
    Effect.provide(Logger.pretty),
    Effect.runPromise
  );
