'use strict'
import { parse as _parse, stringify as _stringify } from '..'
import { TomlError } from '../lib/toml-parser.js'
import testParser from './lib/test-parser.js'
import testStringifier from './lib/test-stringifier.js'

const toTest = {
  name: '@iarna/toml',
  parse: _parse,
  stringify: _stringify,
  ErrorClass: TomlError
}

testParser([toTest], `${__dirname}/spec-test/values`, `${__dirname}/spec-test/errors`)
testStringifier([toTest], `${__dirname}/spec-test/values`)
