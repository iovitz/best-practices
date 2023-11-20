#!/usr/bin/env node
const importLocal = require('import-local')

// 优先使用项目中安装的版本
if (importLocal(__filename)) {
  console.log('本地版本')
} else {
  const fn = require('../lib/index')
  console.log(fn)
}
