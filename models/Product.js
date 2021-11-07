class Product {
  constructor(name, display, synonyms=[]) {
    this.name = name
    this.display = display // has a title, description and possibly an image url
    this.synonyms = synonyms
  }
}
  
module.exports = Product;