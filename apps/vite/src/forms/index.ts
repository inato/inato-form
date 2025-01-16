import Simple from "./Simple"
import type { FormExample } from "./utils"
import { makeFormExample } from "./utils"

const all: ReadonlyArray<FormExample> = [
  makeFormExample(Simple, { route: "/simple", title: "Simple form" })
]

export default all
