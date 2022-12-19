'use strict'
export default runTests

import { readFileSync } from 'fs'
import { basename } from 'path'
import { test } from './tap-is-deeply.js'
import { sync as glob } from 'glob'
import getExpected from './get-expected.js'

function runTests (parsers, valid, error, skip) {
  /* eslint-disable security/detect-non-literal-regexp */
  const skipre = skip && new RegExp(skip.join('|'))
  /* eslint-disable security/detect-non-literal-fs-filename */
  const tests = glob(`${valid}/*toml`)
    .filter(_ => !skipre || !skipre.test(_))
  const errorAsserts = glob(`${error}/*toml`)
    .filter(_ => !skipre || !skipre.test(_))
  parsers.forEach(parser => {
    test(parser.name, t => {
      t.test('spec-asserts', t => {
        t.plan(tests.length)
        for (let spec of tests) {
          const rawToml = readFileSync(spec, 'utf8')
          const expected = getExpected(spec)
          const name = basename(spec, '.toml')
          try {
            t.deeplyObjectIs(parser.parse(rawToml), expected, name)
          } catch (err) {
            t.error(err, name)
          }
        }
      })
      t.test('spec-error-asserts', t => {
        t.plan(errorAsserts.length)
        for (let spec of errorAsserts) {
          const rawToml = readFileSync(spec, 'utf8')
          const name = 'should throw: ' + basename(spec, '.toml')
          t.throws(() => t.comment(parser.parse(rawToml)), parser.ErrorClass, name)
        }
      })
      t.done()
    })
  })
}
