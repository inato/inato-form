import "@mantine/core/styles.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import forms from "./forms";
import { MantineProvider } from "@mantine/core";
import { Layout } from "./Layout";

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {forms.map((Form) => (
              <Route key={Form.route} path={Form.route} element={<Form />} />
            ))}
            <Route path="*" element={<Navigate to="/simple" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
