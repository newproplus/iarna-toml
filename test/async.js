'use strict'
import { test } from 'tap'
import { parse } from '../toml.js'

test('async', t => {
  t.plan(4)
  return parse.async('a = 230', {blocksize: 2}).then(result => {
    t.isDeeply(result, {a: 230}, 'async with small blocksize')
    return parse.async('a = 230')
  }).then(result => {
    t.isDeeply(result, {a: 230}, 'async with large blocksize')
    return parse.async('a = error').catch(() => {
      t.pass('captured early error')
      return parse.async('a = [')
    }).catch(() => {
      t.pass('captured late error')
    })
  })
})
