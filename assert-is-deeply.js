'use strict'
import assert from 'assert'
import isDeeply from './test/lib/is-deeply.js'
export default (a, b) => assert(isDeeply(a, b))
