'use strict'
const TOMLParser = require('../lib/toml-parser').makeParserClass(require('../lib/parser-debug.js'))
import prettyError from '../parse-pretty-error'
import { inspect } from 'util'
const dump = d => inspect(d, {colors: true, depth: Infinity})

success()
failure()

function success () {
  let testtoml = `a = [1.0,1e0]`

  console.log('Parsing:', testtoml)
  const parser = new TOMLParser()
  try {
    parser.parse(testtoml)
    console.log('Result:', dump(parser.finish()))
  } catch (err) {
    console.error('Error:', prettyError(err, testtoml).message)
  }
}

function failure () {
  let testtoml = `a = [1.0,1e0`

  console.log('Parsing:', testtoml)
  const parser = new TOMLParser()
  try {
    parser.parse(testtoml)
    console.log('Result:', dump(parser.finish()))
  } catch (err) {
    console.error('Error:', prettyError(err, testtoml).message)
  }
}
