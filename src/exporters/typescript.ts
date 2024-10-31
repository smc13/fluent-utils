import type { KeyedParsedPlaceable } from '../utils/merge'
import { FLUENT_BUILTIN_FUNCTIONS, PREAMBLE } from '../const'

export default function (data: KeyedParsedPlaceable, langs: string[] = [], prefix: string = 'Fluent') {
  const output = [PREAMBLE]

  // export functions
  output.push(`export type ${prefix}BuiltinFunctions = ${FLUENT_BUILTIN_FUNCTIONS.map(f => `'${f}'`).join(' | ')}\n`)
  output.push(...exportCustomFunctions(data, prefix))

  output.push(`export type ${prefix}Langs = ${langs.map(lang => `'${lang}'`).join(' | ')}\n`)

  // export all keys
  output.push(`export type ${prefix}Keys = {`)
  for (const [key, keyInfo] of data) {
    let variables = 'undefined'
    if (keyInfo.variables.size > 0) {
      // variables = `{ ${keyInfo.variables.map(arg => `${arg}: any`).join(', ')} }`
      variables = `[${Array.from(keyInfo.variables).map(arg => `'${arg}'`).join(', ')}]`
    }

    const attributes = Array.from(keyInfo.attributes).map(attr => `'${attr}'`).join(', ')

    output.push(`  '${key}': { variables: ${variables}, attributes: [${attributes}] };`)
  }

  output.push('}')
  return output.join('\n')
}

function exportCustomFunctions(data: KeyedParsedPlaceable, prefix: string) {
  const customFunctions = new Set<string>()
  for (const [, { functions }] of data) {
    for (const func of functions) {
      if (FLUENT_BUILTIN_FUNCTIONS.includes(func))
        continue
      customFunctions.add(func)
    }
  }

  if (customFunctions.size === 0) {
    return []
  }

  return [`export type ${prefix}CustomFunctions = ${Array.from(customFunctions).map(f => `'${f}'`).join(' | ')}\n`]
}
