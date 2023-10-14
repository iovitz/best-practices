const LRU = Symbol("Application#lru");
const LRUCache = require("ylru");
module.exports = {
  get lru() {
    if (!this[LRU]) {
      this[LRU] = new LRUCache(1000);
    }
    return this[LRU];
  },

  get isProd() {
    return this.env === "prod";
  },
};
