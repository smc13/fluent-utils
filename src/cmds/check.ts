import type { Annotation } from '@fluent/syntax'
import { readFileSync } from 'node:fs'
import { relative } from 'node:path'
import { cwd, exit } from 'node:process'
import { columnOffset, lineOffset } from '@fluent/syntax'
import chalk from 'chalk'
import { defineCommand } from 'citty'
import { glob } from 'tinyglobby'
import { parseContent, parseLangCodeFromPath } from '../parse'
import * as console from '../utils/console'

interface Summary {
  files: number
  syntaxIssues: number
  missingKeys: Set<string>
  languages: Map<string, Set<string>>
}

export const check = defineCommand({
  meta: {
    name: 'check',
    description: 'Check the validity of Fluent files',
  },
  args: {
    glob: {
      type: 'positional',
      description: 'Glob pattern to search for Fluent files',
      default: '**/*.ftl',
    },
    syntax: {
      type: 'boolean',
      description: 'Check syntax of Fluent files',
      default: true,
    },
    summary: {
      type: 'boolean',
      description: 'Print a summary of the check',
      default: true,
    },
  },

  async run({ args }) {
    const files = await glob(args.glob, {})
    const summary: Summary = {
      files: files.length,
      syntaxIssues: 0,
      missingKeys: new Set<string>(),
      languages: new Map<string, Set<string>>(),
    }

    const languageKeys = new Map<string, Set<string>>()
    console.debug(`parsing ${files.length} files...`)
    console.emptyLine()

    for (const file of files) {
      const content = readFileSync(file, 'utf-8')
      const parsed = parseContent(content)
      const lang = parseLangCodeFromPath(file)

      if (!lang) {
        console.warn(`Could not determine language for file: ${file}`)
        continue
      }

      if (!languageKeys.has(lang)) {
        languageKeys.set(lang, new Set<string>())
      }

      for (const key of parsed.messages.keys()) {
        languageKeys.get(lang)!.add(key)
      }

      if (args.syntax && parsed.junk.length > 0) {
        for (const junk of parsed.junk) {
          printJunk(file, content, junk.annotations)
        }

        summary.syntaxIssues += parsed.junk.length
      }

      summary.languages.set(lang, languageKeys.get(lang)!)
    }

    if (summary.syntaxIssues > 0)
      console.emptyLine()

    console.info(`checking for missing keys across ${languageKeys.size} languages...`)
    for (const [lang, keys] of languageKeys) {
      const missing = new Set<string>()
      // loop through all other languages and check if they have the same keys
      for (const [otherLang, otherKeys] of languageKeys) {
        if (lang === otherLang)
          continue
        for (const key of otherKeys) {
          if (!keys.has(key)) {
            missing.add(key)
            summary.missingKeys.add(key)
          }
        }
      }

      if (missing.size > 0) {
        console.warn(`${missing.size} missing keys for \`${lang}\`:`)
        console.log(console.indent(Array.from(missing).join(', '), 2))
      }
      else {
        console.success(console.indent(`all keys found for ${lang}`, 2))
      }
    }

    args.summary && writeSummary(summary)

    // exit with non-zero code if there are issues
    exit(summary.syntaxIssues + summary.missingKeys.size)
  },
})

/**
 * Print junk annotations to the console
 */
function printJunk(file: string, source: string, annotations: Annotation[]) {
  for (const junk of annotations) {
    const line = lineOffset(source, junk.span!.start) + 1
    const column = columnOffset(source, junk.span!.start) + 1

    const relPath = relative(cwd(), file)
    console.error(`${junk.code} ${junk.message}`)
    console.log(console.indent(chalk.dim(`${relPath}:${line}:${column}`, 2)))
    for (const frameLine of console.frame(source, line, column)) {
      console.log(console.indent(frameLine, 2))
    }
  }
}

/**
 * Write a summary of the check
 */
function writeSummary({ files, languages, missingKeys, syntaxIssues }: Summary) {
  const padding = Math.floor(Math.max(files, languages.size, missingKeys.size, syntaxIssues) / 10)

  const filesText = chalk.dim(files.toString().padStart(padding, ' '))
  const languagesText = chalk.blueBright(languages.size.toString().padStart(padding, ' '))
  const missingText = missingKeys.size > 0 ? chalk.yellow(missingKeys.size.toString().padStart(padding, ' ')) : chalk.green(missingKeys.size.toString().padStart(padding, ' '))
  const issuesText = syntaxIssues > 0 ? chalk.red(syntaxIssues.toString().padStart(padding, ' ')) : chalk.green(syntaxIssues.toString().padStart(padding, ' '))

  const lines = [
    chalk.bold('Summary'),
    `${filesText} files parsed`,
    `${languagesText} languages discovered`,
    `${missingText} missing keys`,
    `${issuesText} syntax issues`,
  ]

  console.box(lines.join('\n'))
}
