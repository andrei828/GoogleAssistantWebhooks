const Order = require('../models/Order')
const Product = require('../models/Product')

class OrderService {
  constructor() {
    this.orders = {}
  }

  addNewOrder(name, sessionID) {
    const order = new Order(new Product(name))
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