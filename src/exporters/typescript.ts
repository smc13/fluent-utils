import type { KeyedParsedPlaceable } from '../utils/merge'
import { FLUENT_BUILTIN_FUNCTIONS, PREAMBLE } from '../const'
import MagicString from 'magic-string'

export default function (data: KeyedParsedPlaceable, langs: string[] = [], prefix: string = 'Fluent') {
  const output = new MagicString(PREAMBLE)

  output.append(`import { FluentVariable } from '@fluent/bundle';\n`)
  output.append(`import { FluentMessageInfo } from '@anchanix/fluent-utils';\n`)
  output.append('\n')

  // export functions
  output.append(`export type ${prefix}Functions = ${FLUENT_BUILTIN_FUNCTIONS.map(f => `'${f}'`).join(' | ')}\n`)
  output.append(exportCustomFunctions(data, prefix))
  output.append('\n')

  // export used languages
  output.append(`export type ${prefix}Langs = ${langs.map(lang => `'${lang}'`).join(' | ')}\n`)
  output.append('\n')

  // export all keys
  output.append(`export type ${prefix}MessageKeys = {\n`)
  for (const [key, keyInfo] of data) {
    let variables = 'undefined'
    if (keyInfo.variables.size > 0) {
      variables = `{${Array.from(keyInfo.variables).map(arg => `${arg}: FluentVariable`).join(', ')}}`
    }

    const attributes = `{${Array.from(keyInfo.attributes).map(attr => `'${attr}': string`).join(', ')}}`

    output.append(`  '${key}': FluentMessageInfo<'${key}', ${variables}, ${attributes}>\n`)
  }

  output.append('}\n')
  return output.toString()
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
    return ''
  }

  return `export type ${prefix}CustomFunctions = ${Array.from(customFunctions).map(f => `'${f}'`).join(' | ')}\n`
}
