import type { Placeable } from '@fluent/syntax'
import { merge } from 'es-toolkit'

export interface ParsedPlaceable {
  variables: Set<string>
  functions: Set<string>
  attributes: Set<string>
}

export function parsePlaceable(placeable: Placeable): ParsedPlaceable {
  const expression = placeable.expression
  const parsed: ParsedPlaceable = { variables: new Set([]), functions: new Set([]), attributes: new Set([]) }

  switch (expression.type) {
    case 'Placeable':
      merge(parsed, parsePlaceable(expression))
      break
    case 'VariableReference':
      parsed.variables.add(expression.id.name)
      break
    case 'SelectExpression':
      if (expression.selector.type === 'VariableReference') {
        parsed.variables.add(expression.selector.id.name)
      }
      break

    case 'FunctionReference':
      for (const arg of expression.arguments.positional) {
        if (arg.type === 'VariableReference')
          parsed.variables.add(arg.id.name)
      }

      parsed.functions.add(expression.id.name)
      break
    case 'NumberLiteral':
    case 'StringLiteral':
      break
  }

  return parsed
}
