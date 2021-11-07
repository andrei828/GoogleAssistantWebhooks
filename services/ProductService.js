const ProductRepository = require('../repositories/ProductRepository')

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository()
  }

  getProductList() {
    return this.productRepository.getProductList()
  }
}
  
module.exports = ProductService;