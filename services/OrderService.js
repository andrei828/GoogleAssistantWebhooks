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

  sendOrder(sessionID) {
    this.orders[sessionID].send()
  }
}
  
module.exports = OrderService;