const Product = require('../models/Product')

class ProductRepository {
  
  constructor(storageService) {
    this._storageService = storageService
  }

  getProductList() {
    return [
      // new Product("Product1", { title: "Product1", description: "product description placeholder" }),
      // new Product("Product2", { title: "Product2", description: "product description placeholder" }),
      // new Product("Product3", { title: "Product3", description: "product description placeholder" }),
      // new Product("Product4", { title: "Product4", description: "product description placeholder" }),
      // new Product("Product5", { title: "Product5", description: "product description placeholder" }),
      // new Product("Product6", { title: "Product6", description: "product description placeholder" }),
      // new Product("Product7", { title: "Product7", description: "product description placeholder" }),
      // new Product("Product8", { title: "Product8", description: "product description placeholder" }),
      // new Product("Product9", { title: "Product9", description: "product description placeholder" }),
      // new Product("Product10", { title: "Product10", description: "product description placeholder" }),
      // new Product("Product11", { title: "Product11", description: "product description placeholder" }),
      

      new Product("Bechergläser hohe Form  150 ml", { title: "Bechergläser hohe Form  150 ml" }),
      new Product("Bechergläser hohe Form  100 ml", { title: "Bechergläser hohe Form  100 ml" }),
      new Product("Bechergläser hohe Form   50 ml", { title: "Bechergläser hohe Form   50 ml" }),
      new Product("Bechergläser niedr. Form  100 ml", { title: "Bechergläser niedr. Form  100 ml" }),
      new Product("Bechergläser niedr. Form  50 ml", { title: "Bechergläser niedr. Form  50 ml" }),
      new Product("Bechergläser niedr. Form  25 ml", { title: "Bechergläser niedr. Form  25 ml" }),

      // new Product("1,4-Dioxan, D015", { title: "1,4-Dioxan, D015" }),
      // new Product("1,4-Dioxan, D50", { title: "1,4-Dioxan, D50" }),
      // new Product("1,4-Dioxan, D86 ICH", { title: "1,4-Dioxan, D86 ICH" }),
    ]
  }

}
  
module.exports = ProductRepository;