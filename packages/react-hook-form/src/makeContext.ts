"use client"

import { flow, Option } from "effect"
import type React from "react"
import { createContext, createElement, useContext } from "react"

export interface ProviderProps<Context> {
  value: Context
  children: React.ReactNode
}

export const makeContext = <Context>(contextName: string) => {
  const context = createContext<Context | null>(null)
  context.displayName = contextName
  const Provider = ({ children, value }: ProviderProps<Context>) => createElement(context.Provider, { value }, children)

  const useOptionalContext = () => Option.fromNullable(useContext(context))

  const useContextValue = flow(
    useOptionalContext,
    Option.getOrElse(() => {
      throw new Error(
        `Context not injected, you probably forgot to use the ${contextName} Provider node`
      )
    })
  )

  return {
    Consumer: context.Consumer,
    Provider,
    useContext: useContextValue,
    useOptionalContext
  }
}
