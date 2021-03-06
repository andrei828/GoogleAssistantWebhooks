const Cart = require('../models/Cart')

class CartService {
  constructor(logger, storageService, sessionService) {
    this._logger = logger
    this._storageService = storageService
    this._sessionService = sessionService
  }

  async addNewCart(sessionId) {
    const cart = new Cart(0, client.id)
    await this._sessionService.mapProductToSession(sessionId, cart)
  }

  async commitCart(sessionId, client) {
    const cart = await this._sessionService.getOrderBySession(sessionId)
    await this.storageService.closeCurrentCart(client.id)
    await this.storageService.addNewCart(client.id, cart)
    await this._sessionService.deleteSession(sessionID)
  }

  async getOrdersFromLatestCart(clientId) {
    return await this._storageService.getLatestCartContent(clientId)
  }

  async getOrdersFromLatestCartByMatchCode(clientId, matchCode) {
    return await this._storageService.getOrdersFromLatestCartByMatchCode(clientId, matchCode)
  }
}
  
module.exports = CartService;