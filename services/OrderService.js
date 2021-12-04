const Order = require('../models/Order')

class OrderService {
  constructor(logger, storageService, sessionService) {
    this._logger = logger
    this._storageService = storageService
    this._sessionService = sessionService
  }

  async addNewOrder(clientId, product, quantity, unit) {
    const order = new Order(product, quantity, unit)
    this._logger.info("Created the object: ", JSON.stringify(order, null, 2))
    await this._storageService.addOrderToCart(clientId, order)
  }

  async removeLastOrder(clientId) {
    const order = await this._storageService.getLatestOrderFromLatestCart(clientId)
    this._logger.info("Found this object in the database: ", JSON.stringify(order, null, 2))
    await this._storageService.removeOrderFromCart(clientId, order)
  }

  async cancelOrder(sessionId) {
    await this._sessionService.deleteSession(sessionId)
  }
  
}
  
module.exports = OrderService;