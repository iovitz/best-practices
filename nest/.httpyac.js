// https://httpyac.github.io/
module.exports = {
  defaultHeaders: {
    // 键和值都需要是string类型
    // 键需要以x-开头，标明是一个自定义header
    'x-test': '1',
  },
  environments: {
    $shared: {
    },
    development: {
      host: 'http://localhost:3333',
    },
    production: {
      host: 'http://localhost:3333',
    },
  },
}
