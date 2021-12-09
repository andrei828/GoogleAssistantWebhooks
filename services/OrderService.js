const Order = require('../models/Order')

class OrderService {
  constructor(logger, storageService, sessionService) {
    this._logger = logger
    this._storageService = storageService
    this._sessionService = sessionService
  }

  async addNewOrder(clientId, product, quantity, unit, matchCode) {
    const order = new Order(product, quantity, unit, matchCode)
    this._logger.info("Created the object: ", JSON.stringify(order, null, 2))
    await this._storageService.addOrderToCart(clientId, order)
  }

  async getLatestOrderFromLatestCart(clientId) {
    const order = await this._storageService.getLatestOrderFromLatestCart(clientId)
    this._logger.info(`Found this object in the database: ${JSON.stringify(order, null, 2)}`)
    return order
  }

  async removeOrderFromLatestCart(clientId, order) {
    await this._storageService.removeOrderFromCart(clientId, order)
  }

  
}
  
module.exports = OrderService;