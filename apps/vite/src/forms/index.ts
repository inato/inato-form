import Array from "./Array"
import Conditional from "./Conditional"
import Simple from "./Simple"
import type { FormExample } from "./utils"
import { makeFormExample } from "./utils"

const all: ReadonlyArray<FormExample> = [
  makeFormExample(Simple, { route: "/simple", title: "Simple form" }),
  makeFormExample(Conditional, { route: "/conditional", title: "Conditional rendering" }),
  makeFormExample(Array, { route: "/array", title: "Array of fields" })
]

export default all
