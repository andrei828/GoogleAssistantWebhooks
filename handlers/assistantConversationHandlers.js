const {
  conversation,
  Image,
  List,
  Suggestion,
} = require('@assistant/conversation')

const OrderService = require('../services/OrderService')
const ProductService = require('../services/ProductService')

const orderService = new OrderService()
const productService = new ProductService()

// Create an app instance
const app = conversation()

// Google Assistant handlers
app.handle('Response', conv => {
  console.log(conv)
});

app.handle('Option', conv => {
  const sessionID = conv.request.session.id
  const selectedOption = conv.request.scene.slots.type_option.value

  orderService.addNewOrder(selectedOption, sessionID)
  conv.add(`You selected ${selectedOption}. Would you like me to add it to the cart?`)
  conv.add(new Suggestion({ title: "Yes"}))
  conv.add(new Suggestion({ title: "No"}))
});

app.handle('Yes', conv => {
  const sessionID = conv.request.session.id
  const selectedOption = conv.request.scene.slots.type_option.value

  orderService.sendOrder(sessionID)
  conv.add(`Ok, I have added ${selectedOption} to the cart`)
});

app.handle('No', conv => {
  const sessionID = conv.request.session.id

  orderService.sendOrder(sessionID)
  conv.add(`Ok, I have cancelled the order`)
});

app.handle('ProductList', conv => {
  conv.add('Which one?');
  
  // Override type based on slot 'prompt_option'
  conv.session.typeOverrides = [{
    name: 'prompt_option',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: productService.getProductList()
    }
  }];
  
  // Define prompt content using keys
  conv.add(new List({
    title: 'List of items',
    items: productService.getProductList().map(product => { return { key: product.name } })
  }));
});

module.exports = app;