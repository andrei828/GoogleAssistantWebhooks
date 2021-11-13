const {
  conversation,
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
app.handle('UserOption', conv => {
  const sessionID = conv.request.session.id
  const selectedOption = conv.request.scene.slots.druglist.value
  const selectedQuantity = conv.request.session.params.quantity

  const selectedProduct = productService.getProduct(selectedOption)
  orderService.addNewOrder(selectedProduct, selectedQuantity, sessionID)
  
  conv.add(`You selected ${selectedOption}. Would you like me to add it to the cart?`)
  conv.add(new Suggestion({ title: 'Yes'}))
  conv.add(new Suggestion({ title: 'No'}))
});

app.handle('ConfirmOrderWebhook', conv => {
  const sessionID = conv.request.session.id
  const selectedOption = conv.request.scene.slots.druglist.value

  orderService.sendOrder(sessionID)
  conv.add(`Ok, I have added ${selectedOption} to the cart`)
});

app.handle('CancelOrderWebhook', conv => {
  const sessionID = conv.request.session.id

  orderService.cancelOrder(sessionID)
  conv.add(`Ok, I have cancelled the order`)
});

app.handle('ProductList', conv => {
  conv.add('Choose from the options displayed below');
  
  // Override type based on slot 'prompt_option'
  conv.session.typeOverrides = [{
    name: 'DrugList',
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