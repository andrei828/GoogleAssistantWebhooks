const Order = require('../models/Order')

class OrderService {
  constructor(storageService, sessionService) {
    this._storageService = storageService
    this._sessionService = sessionService
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

  async addNewOrder(sessionId, product, quantity, unit) {
    const order = new Order(product, quantity, unit)
    await this._sessionService.mapProductToSession(sessionId, order)
  }

  async commitOrder(sessionId, cart) {
    const order = await this._sessionService.getOrderBySession(sessionId)
    await this.storageService.addOrderToCart(cart, order)
    await this._sessionService.deleteSession(sessionID)
  }

  async cancelOrder(sessionId) {
    await this._sessionService.deleteSession(sessionId)
  }
}
  
module.exports = OrderService;