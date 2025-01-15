import type { Checkbox } from "./Checkbox.js"
import type { CheckboxGroup } from "./CheckboxGroup.js"
import type { MultiSelect } from "./MultiSelect.js"
import type { NumberInput } from "./NumberInput.js"
import type { RadioGroup } from "./RadioGroup.js"
import type { Select } from "./Select.js"
import type { TextArea } from "./TextArea.js"
import type { TextInput } from "./TextInput.js"

export type AllFields =
  | Checkbox
  | CheckboxGroup
  | MultiSelect
  | NumberInput
  | RadioGroup
  | Select
  | TextArea
  | TextInput
