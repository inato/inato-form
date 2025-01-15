import React from "react";
import {
  AllFields,
  Checkbox,
  CheckboxGroup,
  MultiSelect,
  NumberInput,
  RadioGroup,
  Select,
  TextArea,
  TextInput,
} from "@inato-form/fields";
import type { FormFramework } from "@inato-form/core";
import { Layer, pipe } from "effect";
import * as Mantine from "@mantine/core";

export const layer: Layer.Layer<AllFields, never, FormFramework.FormFramework> =
  pipe(
    Layer.mergeAll(
      TextInput.layerUncontrolled(Mantine.TextInput),
      TextArea.layerUncontrolled(Mantine.Textarea),
      NumberInput.layerControlled(Mantine.NumberInput),
      TextArea.layerUncontrolled(Mantine.Textarea),
      Select.layerControlled(({ options, ...props }) => (
        <Mantine.Select {...props} data={options} />
      )),
      MultiSelect.layerControlled(({ options, ...props }) => (
        <Mantine.MultiSelect {...props} data={options} />
      )),
      RadioGroup.layerControlled(({ options, ...props }) => (
        <Mantine.Radio.Group {...props}>
          <Mantine.Group mt="xs">
            {options.map((props) => (
              <Mantine.Radio key={props.value} {...props} />
            ))}
          </Mantine.Group>
        </Mantine.Radio.Group>
      )),
      Checkbox.layerUncontrolled(Mantine.Checkbox),
      CheckboxGroup.layerControlled(({ options, ...props }) => (
        <Mantine.Checkbox.Group {...props}>
          <Mantine.Group mt="xs">
            {options.map((props) => (
              <Mantine.Checkbox key={props.value} {...props} />
            ))}
          </Mantine.Group>
        </Mantine.Checkbox.Group>
      ))
    )
  );
