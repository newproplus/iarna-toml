/*
This file modified from benchmark.js in toml-j0.4 and that file has the following license:

The MIT License (MIT)

Copyright (c) 2015 Jak Wings

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import assertIsDeeply from './assert-is-deeply.js'
import { readFileSync, writeFileSync } from 'fs'
// import { sync as glob } from 'glob'
import pkg_glob from 'glob';
const { sync: glob } = pkg_glob;
// const cursor = require('ansi')(process.stdout)
import ansi from 'ansi'
const cursor = ansi.Cursor
// const cursor = ansi.process.stdout
import pkg_benchmark from 'benchmark'
const { Suite } = pkg_benchmark;
import parseIarnaToml from './parse-string.js'
import { parse as parseToml } from 'toml'
// import { parse as parseTomlj04 } from 'toml-j0.4'
import pkg_toml_j from 'toml-j0.4';
const { parse: parseTomlj04 } = pkg_toml_j;
import { TomlReader } from '@sgarciac/bombadil'
function parseBombadil(str) {
  const reader = new TomlReader()
  reader.readToml(str)
  if (reader.result === null) throw reader.errors
  return reader.result
}
// import { parse as _parse } from '@ltd/j-toml'
import pkg_j_toml from '@ltd/j-toml';
const { parse: _parse } = pkg_j_toml;
function parseLtdToml(str) {
  return _parse(str, 0.5, '\n')
}
// import { parse as parseFastToml } from 'fast-toml'
import pkg_fast_toml from 'fast-toml';
const { parse: parseFastToml } = pkg_fast_toml;
const fixtures = glob(`${__dirname}/benchmark/*.toml`)
  .concat(glob(`${__dirname}/test/spec-test/*toml`))
  /* eslint-disable security/detect-non-literal-fs-filename */
  .map(_ => ({ name: _, data: readFileSync(_, { encoding: 'utf8' }) }))
/* eslint-enable security/detect-non-literal-fs-filename */
fixtures.forEach(_ => { _.answer = parseIarnaToml(_.data) })
var results

console.error(fixtures.reduce((acc, _) => acc + _.data.length, 0))
try {
  results = JSON.parse(readFileSync('./benchmark-results.json'))
} catch (_) {
  results = {}
}

const suite = new Suite({
  onStart: function () {
    console.log('Overall Benchmarking...')
  },
  onComplete: function () {
    console.log('Overall Successful:\n\t' +
      this.filter('successful').map('name').join(', '))
    console.log('Overall Fastest:\n\t' +
      this.filter('fastest').map('name').join(', '))
    if (!results[process.version]) results[process.version] = {}
    const data = results[process.version].overall = {}
    this.forEach(_ => {
      const name = _.name || (_.isNaN(_.id) ? _.id : '<Test #' + _.id + '>')
      if (_.error) {
        data[name] = { crashed: true }
      } else {
        data[name] = {
          opsec: _.hz.toFixed(_.hz < 100 ? 2 : 0),
          errmargin: _.stats.rme.toFixed(2),
          samples: _.stats.sample.length
        }
      }
    })
    writeFileSync('benchmark-results.json', JSON.stringify(results, null, 2))
  },
  onError: function (event) {
    console.error(event.target.error)
  }
})

const onCycle = event => {
  cursor.horizontalAbsolute()
  cursor.eraseLine()
  cursor.write('\t' + event.target)
}
const onComplete = () => cursor.write('\n')

const tests = {
  '@iarna/toml': parseIarnaToml,
  'toml-j0.4': parseTomlj04,
  'toml': parseToml,
  '@sgarciac/bombadil': parseBombadil,
  '@ltd/j-toml': parseLtdToml,
  'fast-toml': parseFastToml
}

Object.keys(tests).forEach(name => {
  const parse = tests[name]
  try {
    fixtures.forEach(_ => {
      assertIsDeeply(parse(_.data), _.answer)
    })
    suite.add(name, {
      maxTime: 15,
      onCycle,
      onComplete,
      fn() {
        fixtures.forEach(_ => {
          parse(_.data)
        })
      }
    })
  } catch (_) {
    suite.add(name, {
      maxTime: 15,
      onCycle,
      onComplete,
      fn() {
        /* eslint-disable no-throw-literal */
        throw 'skipping: crashed or did not produce valid results'
      }
    })
  }
})

suite.run()
