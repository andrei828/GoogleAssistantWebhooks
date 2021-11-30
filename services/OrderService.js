const Order = require('../models/Order')

class OrderService {
  constructor(storageService) {
    this._storageService = storageService
  }

  addNewOrder(product, quantity, sessionID) {
    const order = new Order(product, quantity)
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