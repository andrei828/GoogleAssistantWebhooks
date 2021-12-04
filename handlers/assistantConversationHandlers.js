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
const ConversationParser = require('../utils/ConversationParser')

const logger = new Logger()
const conversationParser = new ConversationParser()
const storageService = new StorageService(logger)
const sessionService = new SessionService(logger, storageService)
const productService = new ProductService(logger, storageService)
const cartService = new CartService(logger, storageService, sessionService)
const orderService = new OrderService(logger, storageService, sessionService)


// Create an app instance
const app = conversation()

// Google Assistant handlers
app.handle('RemoveLatestOrderFromCart', async conv => {
  const clientId = conversationParser.getClientId(conv)
  await orderService.removeLastOrder(clientId)
  conv.add(`Do you want me to remove ${selectedOption} from your cart?`)
  conv.add(new Suggestion({ title: 'Yes'}))
  conv.add(new Suggestion({ title: 'No'}))
})

app.handle('RemoveLatestOrderFromCart', async conv => {
  const clientId = conversationParser.getClientId(conv)
  await orderService.removeLastOrder(clientId)
  conv.add(`Do you want me to remove ${selectedOption} from your cart?`)
  conv.add(new Suggestion({ title: 'Yes'}))
  conv.add(new Suggestion({ title: 'No'}))
})

app.handle('CancelRemovalOfLastOrder', async conv => {
  conv.add(`Ok, I won't remove the item.`)
  conv.request.session.params = null
})

app.handle('CancelNewOrder', async conv => {
  conv.add(`Ok, I have canceled your order.`)
  conv.request.session.params = null
})

app.handle('CommitNewOrder', async conv => {
  const clientId = conversationParser.getClientId(conv)
  const selectedOption = conv.request.scene.slots.ProductName.value
  const selectedQuantity = conv.request.session.params.quantity
  const unitOfMeasurement = conversationParser.getUnitOfMeasurementFromSession(conv, selectedOption)
  
  await orderService.addNewOrder(clientId, selectedOption, selectedQuantity, unitOfMeasurement)
  conv.add(`Ok, I have added ${selectedOption} to the cart`)
  // conv.add(`Ich habe ${selectedOption} an dem Korb hinzugefügt`)

  conv.request.session.params = null
})

app.handle('AddOrderProductChosen', async conv => {
  const selectedOption = conv.request.scene.slots.ProductName.value
  conv.add(`You selected ${selectedOption}. Would you like me to add it to the cart?`)
  conv.add(new Suggestion({ title: 'Yes'}))
  conv.add(new Suggestion({ title: 'No'}))

  // conv.add(`Sie haben ${selectedOption} ausgewählt. Möchten Sie es in den Warenkorb hinzufügen?`)
  // conv.add(new Suggestion({ title: 'Ja'}))
  // conv.add(new Suggestion({ title: 'Nein'}))
})

app.handle('AddOrderListProducts', async conv => {
  conv.add('Choose from the options displayed below')

  const matchCode = conv.request.intent.params.matchCode.resolved
  logger.info(`Match code is ${matchCode}`)

  // conv.add('Wählen Sie aus den unten angezeigten Möglichkeiten')
  // console.log(JSON.stringify(conv, null, 2))
  
  // Override type based on slot 'prompt_option'
  const products = await productService.getProductsByMatchCode(matchCode)
  logger.info(products)

  conv.session.params.quantity = conv.request.intent.params.quantity.resolved
  conv.session.params.options = products.map(product => {
    return {
      key: product.name,
      unit: product.UoM
    }
  })

  conv.session.typeOverrides = [{
    name: 'ProductChoice',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: products.map(product => {
        return {
          name: product.name,
          display: {
            title: product.name,
            description: `Supplier: ${product.supplier},\nUnit of measurement: ${product.UoM}`
          },
          synonyms: []
        }
      })
    }
  }]
  
  // Define prompt content using keys
  conv.add(new List({
    title: 'Liste',//'List of items',
    items: products.map(product => { return { key: product.name } })
  }))
})







////////////////////////////////////////////////////////////////////////////////////////////////
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