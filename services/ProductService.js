const Product = require('../models/Product')

class ProductService {
  constructor() {
    this.orders = {}
  }

  getProductList() {
    return [
      new Product("Product1", { title: "Product1", description: "product description placeholder" }),
      new Product("Product2", { title: "Product2", description: "product description placeholder" }),
      new Product("Product3", { title: "Product3", description: "product description placeholder" }),
      new Product("Product4", { title: "Product4", description: "product description placeholder" }),
      new Product("Product5", { title: "Product5", description: "product description placeholder" }),
      new Product("Product6", { title: "Product6", description: "product description placeholder" }),
      new Product("Product7", { title: "Product7", description: "product description placeholder" }),
      new Product("Product8", { title: "Product8", description: "product description placeholder" }),
      new Product("Product9", { title: "Product9", description: "product description placeholder" }),
      new Product("Product10", { title: "Product10", description: "product description placeholder" }),
      new Product("Product11", { title: "Product11", description: "product description placeholder" }),
    ]
  }

}
  
module.exports = ProductService;