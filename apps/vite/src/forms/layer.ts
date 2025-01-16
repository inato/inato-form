import { MantineFields } from "@inato-form/mantine"
import { ReactHookForm } from "@inato-form/react-hook-form"
import * as Mantine from "@mantine/core"
import { Layer, pipe } from "effect"

export const MantineReactHookFormLive = pipe(
  MantineFields.layer,
  Layer.provideMerge(ReactHookForm.layer(Mantine.Button))
)
