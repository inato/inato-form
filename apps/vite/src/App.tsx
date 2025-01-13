import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import Simple from "./Simple";

function App() {
  return (
    <MantineProvider>
      <Simple />
    </MantineProvider>
  );
}

export default App;
