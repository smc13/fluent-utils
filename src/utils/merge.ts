import type { ParsedPlaceable } from '../parse'

export type KeyedParsedPlaceable = Map<string, ParsedPlaceable>

export function mergeParsed(...parsed: KeyedParsedPlaceable[]): KeyedParsedPlaceable {
  const merged = new Map<string, ParsedPlaceable>()

  for (const data of parsed) {
    for (const [key, value] of data) {
      if (!merged.has(key)) {
        merged.set(key, value)
        continue
      }

      const mergedValue = mergeParsedPlaceable(merged.get(key)!, value)
      merged.set(key, mergedValue)
    }
  }

  return merged
}

export function mergeParsedPlaceable(...parsed: ParsedPlaceable[]): ParsedPlaceable {
  const merged: ParsedPlaceable = { variables: new Set([]), functions: new Set([]), attributes: new Set([]) }

  for (const data of parsed) {
    merged.variables = new Set([...merged.variables, ...data.variables])
    merged.functions = new Set([...merged.functions, ...data.functions])
    merged.attributes = new Set([...merged.attributes, ...data.attributes])
  }

  return merged
}
