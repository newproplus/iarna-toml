'use strict'
export default runTests

import { basename } from 'path'
import { test } from './tap-is-deeply.js'
import { sync as glob } from 'glob'
import { parse } from '../..'
import getExpected from './get-expected.js'

function runTests (parsers, valid, skip) {
  /* eslint-disable security/detect-non-literal-regexp */
  const skipre = skip && new RegExp(skip.join('|'))
  const tests = glob(`${valid}/*toml`)
    .filter(_ => !skipre || !skipre.test(_))

  parsers.forEach(parser => {
    test(parser.name, t => {
      t.test('stringify-asserts', t => {
        t.plan(tests.length)
        for (let spec of tests) {
          const expected = getExpected(spec)
          const name = basename(spec, '.toml')
          try {
            t.deeplyObjectIs(parse(parser.stringify(expected)), expected, name)
          } catch (err) {
            t.error(err, name)
          }
        }
      })
      t.done()
    })
  })
}
