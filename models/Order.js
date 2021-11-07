const fs = require('fs')
const Logger = require('../services/Logger')
const logger = new Logger()

class Order {
  constructor(item) {
    this.item = item
  }

  async send() {
    await fs.appendFile('orders.txt', `Ordered ${this.item.name}!`, () => {
      logger.log('Successfully placed the order!')
    })
  }

}
    
module.exports = Order;