// https://httpyac.github.io/
module.exports = {
  environments: {
    "$shared": {
    },
    "dev": {
      "host": "http://localhost:26666"
    },
    "prod": {
      "host": "http://localhost:26666"
    }
  },
  defaultHeaders: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
  }
}
