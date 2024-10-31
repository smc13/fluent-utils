#!/usr/bin/env node

import { defineCommand, runMain } from 'citty'
import * as cmds from './cmds'

const main = defineCommand({
  meta: {
    name: 'fluent-utils',
    description: 'Utility commands for working with Fluent files',
  },
  args: {
    debug: {
      type: 'boolean',
      description: 'Enable debug mode',
      alias: ['d'],
    },
  },
  subCommands: cmds,
})

runMain(main)
