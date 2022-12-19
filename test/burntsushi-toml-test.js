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

// these test are not valid for TOML v1.0RC1
const SKIP = [
  'array-mixed-types-strings-and-ints',
  'array-mixed-types-arrays-and-ints',
  'array-mixed-types-ints-and-floats'
]

testParser([toTest], `${__dirname}/burntsushi-toml-test/tests/valid`, `${__dirname}/burntsushi-toml-test/tests/invalid`, SKIP)
testStringifier([toTest], `${__dirname}/burntsushi-toml-test/tests/valid`, SKIP)
