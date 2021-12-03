class SessionService {
  constructor(storageService) {
    this._storageService = storageService
  }

  async mapOrderToSession(sessionId, item) {
    try {
      serializedItem = this.serializeItem(item)
      await this._storageService.addSessionAndOrderDocument(sessionId, item)
    } catch (e) {
      console.log(e)
    }
  }

  // TODO: batch get read and delete queries
  async getOrderBySession(sessionId) {
    try {
      item = await this._storageService.getOrderBySession(sessionId)
      deserializedItem = this.deserializeItem()
      return this.deserializedItem
    } catch (e) {
      console.log(e)
      return null;
    }
  }

  
  async deleteSession(sessionId) {
    try {
      await this._storageService.deleteSession(sessionId)
    } catch (e) {
      console.log(e)
    }
  }

  serializeItem(item) {
    return JSON.stringify(item)
  }

  deserializeItem(item) {
    return JSON.parse(item)
  }
  
}
  
module.exports = SessionService;