const ProductRepository = require('../repositories/ProductRepository')

class ProductService {
  constructor(logger, storageService) {
    this._logger = logger
    this._productRepository = new ProductRepository(storageService)
  }

  async getProducts() {
    return await this._productRepository.getProducts()
  }

  async getProductsByMatchCode(matchCode) {
    return await this._productRepository.getProductsByMatchCode(matchCode)
  }
}
  
module.exports = ProductService;