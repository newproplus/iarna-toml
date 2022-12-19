'use strict'
import { Readable } from 'stream'
import { parse } from '..'
import { inspect } from 'util'
const dump = d => inspect(d, {colors: true, depth: Infinity})

success().then(() => failure())

function streamString (str) {
  // creates a readable stream from a string that just emits the stream as a
  // single block.
  let streamed = false
  return new Readable({
    read () {
      if (streamed) return this.push(null)
      streamed = true
      this.push(str)
    }
  })
}

function success () {
  let testtoml = `a = [1.0,1e0]`

  console.log('Parsing:', testtoml)
  return parse.stream(streamString(testtoml))
    .then(_ => console.log('Result:', dump(_)))
    .catch(_ => console.error('Error:', _.message))
}

function failure () {
  let testtoml = `a = [1.0,1e0`

  console.log('Parsing:', testtoml)
  return parse.stream(streamString(testtoml))
    .then(_ => console.log('Result:', dump(_)))
    .catch(_ => console.error('Error:', _.message))
}
