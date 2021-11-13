const fs = require('fs')
const os = require("os");
const Logger = require('../services/Logger')
const logger = new Logger()

class Order {
  constructor(item, quantity) {
    this.item = item
    this.quantity = quantity
  }

  async send() {
    const timestamp = new Date().toISOString();
    await fs.appendFile('orders.txt', `${timestamp}: Ordered ${this.item.name}. Quantity: ${this.quantity}` + os.EOL, () => {
      logger.log('Successfully placed the order!')
    })
  }

}
    
module.exports = Order;