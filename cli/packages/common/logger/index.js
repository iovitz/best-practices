class Logger {
  log = require('npmlog')

  constructor() {
    this.init()
  }

  init() {
    // 修改 log 的 level
    this.log.level = process.env.LOG_LEVEL ?? 'info '
    // 修改前缀
    this.log.heading = process.env.CLI_NAME ?? 'CLI'

    // 修改前缀样式
    this.log.headingStyle = {
      fg: 'white',
      bg: 'magenta',
      bold: true,
    }

    // 添加 log 类型
    log.addLevel('success', 2000, { fg: 'green', bold: true }, 'SUCC')
  }

  debug(prefix, message, ...args) {
    this.log.verbose(prefix, message, ...args)
  }

  log(prefix, message, ...args) {
    this.log.log(prefix, message, ...args)
  }

  info(prefix, message, ...args) {
    this.log.info(prefix, message, ...args)
  }

  error(prefix, message, ...args) {
    this.log.error(prefix, message, ...args)
  }

  success(prefix, message, ...args) {
    this.log.success(prefix, message, ...args)
  }
}

const logger = new Logger()
