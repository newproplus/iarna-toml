'use strict'
import tap, { deeplyObjectIs, Test, comment } from 'tap'
export default tap

import isDeeply from './is-deeply.js'

if (!deeplyObjectIs) {
  Test.prototype.addAssert('deeplyObjectIs', 2, function (found, wanted, message, extra) {
    const equiv = isDeeply(found, wanted)
    if (!equiv) comment(found, wanted)
    return this.ok(equiv, message, extra)
  })
}
