import { env } from 'node:process'
import chalk from 'chalk'
import { createConsola, LogLevels } from 'consola'

export const isGithubActions = env.GITHUB_ACTIONS === 'true'

export const consola = createConsola({
  level: LogLevels.info,
  fancy: true,
  formatOptions: { date: false },
})

export function success(message: string) {
  consola.success(message)
}

export function info(message: string) {
  consola.info(message)
}

export function warn(message: string) {
  consola.warn(message)
}

export function error(message: string) {
  consola.error(message)
}

export function log(message: string) {
  consola.log(message)
}

export function debug(message: string) {
  consola.debug(message)
}

export function emptyLine(lines = 1) {
  for (let i = 0; i < lines; i++) {
    consola.log('')
  }
}

export function start(message: string) {
  consola.start(message)
}

export function box(message: string) {
  consola.box(message)
}

export function indent(message: string, level: number = 1) {
  return ' '.repeat(level * 2) + message
}

export function frame(source: string, line: number, column: number, range = 0): string[] {
  const lines = source.split(/\r?\n/)
  const start = Math.max(line - range - 1, 0)
  const end = Math.min(lines.length, line + range)

  const frame: string[] = []
  const endLength = String(end).length

  for (let i = start; i < end; i++) {
    let lineContent = lines[i]
    if (i + 1 === line) {
      // highlight the span of the error
      lineContent
        = lineContent.substring(0, column - 1)
        + chalk.red(lineContent.substring(column - 1, column))
        + lineContent.substring(column)
    }

    frame.push(`${chalk.dim(`${(i + 1).toString().padEnd(endLength, ' ')} │`)} ${lineContent}`)

    if (i + 1 === line)
      frame.push(chalk.red(`${''.padEnd(endLength, ' ')}   ${' '.repeat(column - 1)}^`))
  }

  return frame
}
