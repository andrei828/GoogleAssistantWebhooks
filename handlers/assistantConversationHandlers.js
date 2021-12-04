const {
  conversation,
  List,
  Suggestion,
} = require('@assistant/conversation')

const Logger = require('../services/Logger')
const CartService = require('../services/CartService')
const OrderService = require('../services/OrderService')
const ProductService = require('../services/ProductService')
const StorageService = require('../services/StorageService')
const SessionService = require('../services/SessionService')

const logger = new Logger()
const storageService = new StorageService(logger)
const sessionService = new SessionService(logger, storageService)
const productService = new ProductService(logger, storageService)
const cartService = new CartService(logger, storageService, sessionService)
const orderService = new OrderService(logger, storageService, sessionService)


// Create an app instance
const app = conversation()

// Google Assistant handlers
app.handle('UserOption', conv => {
  const sessionID = conv.request.session.id
  const selectedOption = conv.request.scene.slots.druglist.value
  const selectedQuantity = conv.request.session.params.quantity

  const selectedProduct = productService.getProduct(selectedOption)
  orderService.addNewOrder(selectedProduct, selectedQuantity, sessionID)
  
  // conv.add(`You selected ${selectedOption}. Would you like me to add it to the cart?`)
  // conv.add(new Suggestion({ title: 'Yes'}))
  // conv.add(new Suggestion({ title: 'No'}))

  conv.add(`Sie haben ${selectedOption} ausgewählt. Möchten Sie es in den Warenkorb hinzufügen?`)
  conv.add(new Suggestion({ title: 'Ja'}))
  conv.add(new Suggestion({ title: 'Nein'}))
});

app.handle('ConfirmOrderWebhook', conv => {
  const sessionID = conv.request.session.id
  const selectedOption = conv.request.scene.slots.druglist.value

  orderService.sendOrder(sessionID)
  // conv.add(`Ok, I have added ${selectedOption} to the cart`)
  conv.add(`Ich habe ${selectedOption} an dem Korb hinzugefügt`)
});

app.handle('CancelOrderWebhook', conv => {
  const sessionID = conv.request.session.id

  orderService.cancelOrder(sessionID)
  //conv.add(`Ok, I have cancelled the order`)
  conv.add(`Ich habe die Bestellung abgesagt`)
});

app.handle('ProductList', conv => {
  // conv.add('Choose from the options displayed below')
  conv.add('Wählen Sie aus den unten angezeigten Möglichkeiten')

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
    title: 'Liste',//'List of items',
    items: productService.getProductList().map(product => { return { key: product.name } })
  }));
});

module.exports = app;