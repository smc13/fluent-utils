import type { KeyedParsedPlaceable } from '../utils/merge'
import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import { glob } from 'tinyglobby'
import { exportTypescript } from '../exporters'
import { parseContent, parseLangCodeFromPath } from '../parse'
import * as console from '../utils/console'
import { mergeParsed } from '../utils/merge'

export const types = defineCommand({
  meta: {
    name: 'types',
    description: 'Generate TypeScript types from Fluent files',
  },
  args: {
    glob: {
      type: 'positional',
      description: 'Glob pattern to search for Fluent files',
      default: '**/*.ftl',
    },
    output: {
      type: 'string',
      description: 'Where to output the TypeScript file',
      default: './fluent.d.ts',
      alias: ['o'],
    },
    debug: {
      type: 'boolean',
      description: 'Enable debug mode',
      alias: ['d'],
    },
    dry: {
      type: 'boolean',
      description: 'Dry run',
      alias: ['n'],
    },
  },

  async run({ args }) {
    const files = await glob(args.glob, {})
    if (files.length === 0) {
      console.error(`No files found for glob pattern: ${args.glob}`)
      return
    }

    const infos: KeyedParsedPlaceable[] = []

    console.info(`Found ${files.length} files for glob pattern '${args.glob}'`)
    for (const file of files) {
      const content = readFileSync(file, 'utf-8')

      console.debug(`Parsing ${file}`)
      const { messages } = parseContent(content)
      infos.push(messages)
    }

    const langs = new Set<string>()
    for (const file of files) {
      const lang = parseLangCodeFromPath(file)
      if (lang) {
        langs.add(lang)
      }
    }

    const fileContent = exportTypescript(mergeParsed(...infos), Array.from(langs))
    if (!args.dry) {
      let output = args.output
      const stats = statSync(args.output)
      if (stats.isDirectory()) {
        output = `${args.output}/fluent.ts`
      }

      writeFileSync(output, fileContent)
      console.success(`Type file exported to ${output}`)
      return
    }

    console.info('Dry run, not writing to file')
  },
})
