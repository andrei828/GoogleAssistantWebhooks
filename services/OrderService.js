const Order = require('../models/Order')
const Item = require('../models/Product')
const Logger = require('./Logger')
const logger = new Logger()

class OrderService {
  constructor() {
    this.orders = {}
  }

  addNewOrder(name, sessionID) {
    const order = new Order(new Item(name))
    this.orders[sessionID] = order
  }

  confirmOrder(sessionID) {
    this.orders[sessionID].confirm()
  }

  sendOrder(sessionID) {
    this.orders[sessionID].send()
  }

}
  
module.exports = OrderService;