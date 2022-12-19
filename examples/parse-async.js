'use strict'
import { parse } from '..'
import { inspect } from 'util'
const dump = d => inspect(d, {colors: true, depth: Infinity})

success().then(() => failure())

function success () {
  let testtoml = `a = [1.0,1e0]`

  console.log('Parsing:', testtoml)
  return parse.async(testtoml, {blocksize: 4})
    .then(_ => console.log('Result:', dump(_)))
    .catch(_ => console.error('Error:', _.message))
}

function failure () {
  let testtoml = `a = [1.0,1e0`

  console.log('Parsing:', testtoml)
  return parse.async(testtoml, {blocksize: 4})
    .then(_ => console.log('Result:', dump(_)))
    .catch(_ => console.error('Error:', _.message))
}
