class SessionService {
  constructor(storageService) {
    this._storageService = storageService
  }

  async mapProductToSession(sessionId, product) {
    this._storageService.addSessionAndProductDocument(sessionId, product)
  }

  async getProductBySession(sessionId) {
    this._storageService.getProductBySession(sessionId)
  }
  
}
  
module.exports = SessionService;