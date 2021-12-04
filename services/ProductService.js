const ProductRepository = require('../repositories/ProductRepository')

class ProductService {
  constructor(logger, storageService) {
    this._logger = logger
    this._productRepository = new ProductRepository(storageService)
  }

  getProductList() {
    return this._productRepository.getProductList()
  }

  getProduct(name) {
    for (var product of this._productRepository.getProductList()) {
      if (product.name === name) {
        return product
      }
    }
    return null
  }

  async getProducts() {
    return await this._productRepository.getProducts()
  }
}
  
module.exports = ProductService;