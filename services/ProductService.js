const ProductRepository = require('../repositories/ProductRepository')

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository()
  }

  getProductList() {
    return this.productRepository.getProductList()
  }

  getProduct(name) {
    this.productRepository.getProductList().forEach(product => {
      if (product.name === name) {
        return product
      }
    })
    return null
  }
}
  
module.exports = ProductService;