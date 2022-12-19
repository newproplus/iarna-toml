'use strict'
import { TomlError } from '../lib/toml-parser.js'
import testParser from '../test/lib/test-parser.js'

import iarnaToml from '../parse-string.js'
import { version as iarnaTomlVersion } from '../package.json'
import { parse as parseToml } from 'toml'
import { version as tomlVersion } from 'toml/package.json'
import { parse as parseTomlj04 } from 'toml-j0.4'
import { version as tomlj04Version } from 'toml-j0.4/package.json'
import { TomlReader } from '@sgarciac/bombadil'
import { version as bombadilVersion } from '@sgarciac/bombadil/package.json'
import { parse as _parse } from '@ltd/j-toml'
import { version as ltdTomlVersion } from '@ltd/j-toml/package.json'
import { parse as parseFastToml } from 'fast-toml'
import { version as fastTomlVersion } from 'fast-toml/package.json'
function parseLtdToml (str) {
  return _parse(str, 0.5, '\n', Number.MAX_SAFE_INTEGER)
}

class BombadilError extends Error {
  constructor () {
    super()
    this.name = 'BombadilError'
  }
}

const toTest = [
  {
    name: `@iarna/toml@${iarnaTomlVersion}`,
    parse: iarnaToml,
    ErrorClass: TomlError
  },
  {
    name: `toml@${tomlVersion}`,
    parse: parseToml
  },
  {
    name: `toml-j0.4@${tomlj04Version}`,
    parse: parseTomlj04
  },
  {
    name: `@sgarciac/bombadil@${bombadilVersion}`,
    ErrorClass: BombadilError,
    parse: str => {
      // this is assuming that readToml should never throw
      const reader = new TomlReader()
      reader.readToml(str)
      if (reader.result == null) throw new BombadilError(reader.errors)
      return reader.result
    }
  },
  {
    name: `@ltd/j-toml@${ltdTomlVersion}`,
    parse: parseLtdToml
  },
  {
    name: `fast-toml@${fastTomlVersion}`,
    parse: parseFastToml
  }
]

testParser(toTest, `${__dirname}/../test/spec-test/values`, `${__dirname}/../test/spec-test/errors`)
