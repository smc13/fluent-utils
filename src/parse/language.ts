const languages = new Set(['en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'pt', 'ru', 'zh'])

export function parseLangCodeFromPath(path: string): string | undefined {
  const parts = path.split('/')
  const fileName = parts.pop()?.split('.')[0]

  for (const part of [fileName, ...parts.reverse()].filter(p => p !== undefined)) {
    const split = part.split('-')
    if (languages.has(split[0])) {
      return part
    }
  }

  return undefined
}
