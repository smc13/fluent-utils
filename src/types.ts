import type { FluentVariable } from '@fluent/bundle'

export type FluentMessageVariablesGeneric = Record<string, FluentVariable>
export type FluentMessageAttributesGeneric = Record<string, string>

export interface FluentMessageInfo<Key extends string = string, Variables extends FluentMessageVariablesGeneric = FluentMessageVariablesGeneric, Attributes extends FluentMessageAttributesGeneric = FluentMessageAttributesGeneric> {
  key: Key
  variables: Variables
  attributes: Attributes
}

/** A map of Fluent keys to their information, useful as an extendable type for generics */
export type GenericFluentMessageMap = Record<string, FluentMessageInfo>
