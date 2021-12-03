const ProductRepository = require('../repositories/ProductRepository')

class ProductService {
  constructor(storageService) {
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
}
  
module.exports = ProductService;