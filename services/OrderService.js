const Order = require('../models/Order')

class OrderService {
  constructor() {
    this.orders = {}
  }

  addNewOrder(product, sessionID) {
    const order = new Order(product)
    this.orders[sessionID] = order
  }

  async sendOrder(sessionID) {
    await this.orders[sessionID].send()
    delete this.orders[sessionID]
  }

  cancelOrder(sessionID) {
    delete this.orders[sessionID]
  }
}
  
module.exports = OrderService;