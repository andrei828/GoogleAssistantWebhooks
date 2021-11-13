const ProductRepository = require('../repositories/ProductRepository')

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository()
  }

  getProductList() {
    return this.productRepository.getProductList()
  }

  getProduct(name) {
    for (var product of this.productRepository.getProductList()) {
      if (product.name === name) {
        return product
      }
    }
    return null
  }
}
  
module.exports = ProductService;