class Product {
  constructor(name, display, synonyms=[]) {
    this.name = name
    this.display = display
    this.synonyms = synonyms
  }
}
  
module.exports = Product;