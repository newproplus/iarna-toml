'use strict'
export { default } from "./parse-string.js"

import parseAsync_  from './parse-async.js'
import parseStream_  from './parse-stream.js'
import prettyError_  from './parse-pretty-error.js'

export const async = parseAsync_
export const stream = parseStream_
export const prettyError = prettyError_