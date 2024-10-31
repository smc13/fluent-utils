import type { ParsedPlaceable } from '.'
import { parse } from '@fluent/syntax'
import { merge } from 'es-toolkit'
import { mergeParsedPlaceable } from '../utils/merge'
import { parsePlaceable } from './placeable'

export function parseContent(content: string) {
  const ftl = parse(content, { withSpans: true })
  const foundMessages = new Map<string, ParsedPlaceable>()
  const messages = ftl.body.filter(e => e.type === 'Message')
  const junk = ftl.body.filter(e => e.type === 'Junk')

  for (const entry of messages) {
    const id = entry.id.name
    if (!foundMessages.has(id)) {
      foundMessages.set(id, { variables: new Set([]), functions: new Set([]), attributes: new Set([]) })
    }

    const placeables = [
      ...(entry.value?.elements.filter(e => e.type === 'Placeable') ?? []),
      ...(entry.attributes.flatMap(a => a.value.elements.filter(e => e.type === 'Placeable'))),
    ]

    for (const placeable of placeables) {
      const variables = parsePlaceable(placeable)
      foundMessages.set(id, mergeParsedPlaceable(foundMessages.get(id)!, variables))
    }

    const attributeNames = entry.attributes.map(a => a.id.name)
    const merged = merge(foundMessages.get(id)!, { attributes: new Set(attributeNames) })
    foundMessages.set(id, merged)
  }

  return { messages: foundMessages, junk }
}
