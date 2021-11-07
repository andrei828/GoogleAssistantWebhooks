const fs = require('fs')
const Logger = require('../services/Logger')
const logger = new Logger()

class Order {
  constructor(item, confirmed = false) {
    this.item = item
    this.confirmed = confirmed
  }

  confirm() {
    this.confirmed = true
  }

  async send() {
    if (this.confirmed !== true) {
      logger.log('The order is not confirmed.')
      return
    }

    await fs.writeFile('orders.txt', `Ordered ${this.item.name}!`, (err) => {
      logger.log('Failed to place the order')
      logger.log(err)
    })
  }

}
    
module.exports = Order;