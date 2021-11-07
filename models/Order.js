const fs = require('fs')
const os = require("os");
const Logger = require('../services/Logger')
const logger = new Logger()

class Order {
  constructor(item) {
    this.item = item
  }

  async send() {
    const timestamp = new Date().toISOString();
    await fs.appendFile('orders.txt', `${timestamp}: Ordered ${this.item.name}!` + os.EOL, () => {
      logger.log('Successfully placed the order!')
    })
  }

}
    
module.exports = Order;