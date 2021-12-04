const Order = require('../models/Order')

class OrderService {
  constructor(logger, storageService, sessionService) {
    this._logger = logger
    this._storageService = storageService
    this._sessionService = sessionService
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

  async removeLastOrder(sessionId) {
    const order = await this._storageService.getLatestCartContent(cart)
    await this._sessionService.mapProductToSession(sessionId, order)
  }

  async commitOrderRemoval(sessionId) {
    const order = await this._sessionService.getOrderBySession(sessionId)
    await this._storageService.removeOrderFromCart(cart, order)
    await this._sessionService.deleteSession(sessionID)
  }
}
  
module.exports = OrderService;