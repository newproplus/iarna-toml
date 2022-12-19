'use strict'
export default getExpected
import { existsSync, readFileSync } from 'fs'
import { safeLoad } from 'js-yaml'
import expand from './expand-json.js'

function getExpected (spec) {
  /* eslint-disable security/detect-non-literal-fs-filename */
  const yamlName = spec.replace(/[.]toml$/, '.yaml')
  const jsonName = spec.replace(/[.]toml$/, '.json')
  if (existsSync(yamlName)) {
    return safeLoad(readFileSync(yamlName))
  } else if (existsSync(jsonName)) {
    const expected = JSON.parse(readFileSync(jsonName))
    return expand(expected)
  } else {
    return {}
  }
}
