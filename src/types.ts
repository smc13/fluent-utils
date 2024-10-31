import type { FluentVariable } from '@fluent/bundle'

export interface FluentKeyInfo {
  variables: string[] | undefined
  attributes: string[]
}

/** A map of Fluent keys to their information, useful as an extendable type for generics */
export type TypedFluentMap = Record<string, FluentKeyInfo>

export type ArrayToObject<A extends string[], V = undefined> = { [K in A[number]]: V }

export type KeyVariablesAsObject<Info extends FluentKeyInfo> = Info['variables'] extends string[] ? [ArrayToObject<Info['variables'], FluentVariable>] : []
export type KeyAttributesAsObject<Info extends FluentKeyInfo> = ArrayToObject<Info['attributes'], string>
