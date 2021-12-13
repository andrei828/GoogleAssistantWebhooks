const {
  conversation,
  List,
  Table,
  Suggestion,
} = require('@assistant/conversation')

const Logger = require('../services/Logger')
const CartService = require('../services/CartService')
const OrderService = require('../services/OrderService')
const ProductService = require('../services/ProductService')
const StorageService = require('../services/StorageService')
const SessionService = require('../services/SessionService')
const ConversationParser = require('../utils/ConversationParser')

const DEUTSCH = "de"
const ENGLISH = "en"
const logger = new Logger()
const conversationParser = new ConversationParser()
const storageService = new StorageService(logger)
const sessionService = new SessionService(logger, storageService)
const productService = new ProductService(logger, storageService)
const cartService = new CartService(logger, storageService, sessionService)
const orderService = new OrderService(logger, storageService, sessionService)

const deutschIndex = [
  ['erste', 'eins', 'ein', 'eine', 'eines', 'einer'], 
  ['zweite', 'zwei', 'zweitens', 'zweifel', '2D', 'zu weit', 'so weit'], 
  ['dritte', 'drei', 'drittens', 'bitte', 'briete', 'britte', '3D', 'bright'],
  ['vierte', 'vier', 'mir', 'eir', 'ihr', 'von', 'viel', 'fieber', 'wir'],
  ['fünfte', 'fünf', 'film', 'für', 'Führung'],
  ['sechste', 'sechs', 'uhr', 'sechs'],
  ['siebte'],
  ['achte'],
  ['neunte'],
  ['zehnte', 'zehn', 'ZDS', 'zen']
]

// Create an app instance
const app = conversation()

// Deckel mock handlers
app.handle('XGetDeckelConfirmation', async conv => {
  const language = conversationParser.getLanguage(conv)
  const selectedOption = conv.request.scene.slots.ProductName.value
  const selectedQuantity = conv.request.session.params.quantity

  if (language === DEUTSCH) {
    conv.add(`Sie haben ${selectedQuantity} Stück von ${selectedOption} ausgewählt. Möchten Sie es in den Warenkorb hinzufügen?`)
    conv.add(new Suggestion({ title: 'Ja'}))
    conv.add(new Suggestion({ title: 'Nein'}))
  } else {
    conv.add(`You selected ${selectedQuantity} of ${selectedOption}. Would you like me to add it to the cart?`)
    conv.add(new Suggestion({ title: 'Yes'}))
    conv.add(new Suggestion({ title: 'No'}))
  }
})

app.handle('XCommitDeckelOrder', async conv => {
  const language = conversationParser.getLanguage(conv)
  const clientId = conversationParser.getClientId(conv)
  const selectedOption = conv.request.scene.slots.ProductName.value
  const selectedQuantity = conv.request.session.params.quantity
  const unitOfMeasurement = conversationParser.getUnitOfMeasurementFromSession(conv, selectedOption)
  const matchCodeFromSession = conversationParser.getMatchCodeFromSession(conv, selectedOption)

  await orderService.addNewOrder(
    clientId, selectedOption, selectedQuantity, unitOfMeasurement, matchCodeFromSession
  )

  if (language === DEUTSCH) {
    conv.add(`Ich habe ${selectedOption} an dem Korb hinzugefügt`)
  } else {
    conv.add(`Ok, I have added ${selectedOption} to the cart`)
  }
  conv.request.session.params = null
})

app.handle('XCancelNewOrder', async conv => {
  const language = conversationParser.getLanguage(conv)
  if (language === DEUTSCH) {
    conv.add(`Ok, ich habe die Bestellung abgesagt.`)
  } else {
    conv.add(`Ok, I have canceled your order.`)
  }
  conv.request.session.params = null
})

app.handle('XGetDeckelListPVC', async conv => {
  const language = conversationParser.getLanguage(conv)
  //const matchCode = conv.request.intent.params.matchCode.resolved
  const matchCode = 'DeckelPVC'
  logger.info(`Match code is ${matchCode}`)
  console.log(JSON.stringify(conv, null, 2))
  // Override type based on slot 'prompt_option'
  const products = await productService.getProductsByMatchCode(matchCode)
  logger.info(products)

  if (products.length < 1) {
    if (language === DEUTSCH) {
      conv.add(`Es gibt kein ${matchCode} in der Datenbank`)
    } else {
      conv.add(`There is no ${matchCode} product in the database`)
    }
    return
  }

  let listTitle = 'List of items'
  if (language === DEUTSCH) {
    listTitle = 'Liste'
    conv.add('Wählen Sie aus den unten angezeigten Möglichkeiten')
  } else {
    conv.add('Choose from the options displayed below')
  }

  conv.session.params.quantity = conv.request.session.params.quantity
  conv.session.params.options = products.map(product => {
    return {
      key: product.name,
      unit: product.UoM,
      matchCode: product.matchCode
    }
  })

  conv.session.typeOverrides = [{
    name: 'ProductChoice',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: products.map((product, index) => {
        return {
          name: product.name,
          display: {
            title: `${index + 1}) ${product.name}`,
            description: (language === DEUTSCH) ?
              `Lieferant: ${product.supplier}, Maßeinheit: ${product.UoM}`
              :
              `Supplier: ${product.supplier}, Unit of measurement: ${product.UoM}`
          },
          synonyms: [...deutschIndex[index]]
        }
      })
    }
  }]
  
  // Define prompt content using keys
  conv.add(new List({
    title: listTitle,
    items: products.map(product => { return { key: product.name } })
  }))
})

app.handle('XGetDeckelListGlass', async conv => {
  const language = conversationParser.getLanguage(conv)
  //const matchCode = conv.request.intent.params.matchCode.resolved
  const matchCode = 'DeckelGlass'
  logger.info(`Match code is ${matchCode}`)
  console.log(JSON.stringify(conv, null, 2))
  // Override type based on slot 'prompt_option'
  const products = await productService.getProductsByMatchCode(matchCode)
  logger.info(products)

  if (products.length < 1) {
    if (language === DEUTSCH) {
      conv.add(`Es gibt kein ${matchCode} in der Datenbank`)
    } else {
      conv.add(`There is no ${matchCode} product in the database`)
    }
    return
  }

  let listTitle = 'List of items'
  if (language === DEUTSCH) {
    listTitle = 'Liste'
    conv.add('Wählen Sie aus den unten angezeigten Möglichkeiten')
  } else {
    conv.add('Choose from the options displayed below')
  }

  conv.session.params.quantity = conv.request.session.params.quantity
  conv.session.params.options = products.map(product => {
    return {
      key: product.name,
      unit: product.UoM,
      matchCode: product.matchCode
    }
  })

  conv.session.typeOverrides = [{
    name: 'ProductChoice',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: products.map((product, index) => {
        return {
          name: product.name,
          display: {
            title: `${index + 1}) ${product.name}`,
            description: (language === DEUTSCH) ?
              `Lieferant: ${product.supplier}, Maßeinheit: ${product.UoM}`
              :
              `Supplier: ${product.supplier}, Unit of measurement: ${product.UoM}`
          },
          synonyms: [...deutschIndex[index]]
        }
      })
    }
  }]
  
  // Define prompt content using keys
  conv.add(new List({
    title: listTitle,
    items: products.map(product => { return { key: product.name } })
  }))
})

app.handle('XSetQuantityForDeckalOrder', async conv => {
  conv.session.params.quantity = conv.request.intent.params.quantity.resolved
})


// Google Assistant handlers
app.handle('GetOrdersFromCart', async conv => {
  const clientId = conversationParser.getClientId(conv)
  const orders = await cartService.getOrdersFromLatestCart(clientId)
  const language = conversationParser.getLanguage(conv)

  let listTitle = 'Orders'
  let listSubtitle = 'What you ordered this month'
  let orderNameHeader = 'Item name'
  let orderQuantityHeader = 'Quantity'
  let speech = 'Here is the Cart'

  if (language === DEUTSCH) {
    listTitle = 'Bestellungen'
    listSubtitle = 'Was haben Sie diese Monat bestellt'
    orderNameHeader = 'Name'
    orderQuantityHeader = 'Quantität'
    speech = 'Hier ist der Einkaufswagen'
  }

  conv.add(speech)
  conv.add(new Table({
    'title': listTitle,
    'subtitle': listSubtitle,
    'columns': [{
      'header': orderNameHeader
    }, {
      'header': orderQuantityHeader
    }],
    'rows': orders.map((order, index) => {
      return {
        cells: [{
          text: `${index + 1}) ${order.item}`
        },{
          text: `${order.quantity} ${order.unit}`
        }]
      }
    })
  }));
})

app.handle('RemoveLatestOrderFromCart', async conv => {
  const language = conversationParser.getLanguage(conv)
  const clientId = conversationParser.getClientId(conv)
  const latestOrder = JSON.parse(conv.session.params.order)
  await orderService.removeOrderFromLatestCart(clientId, latestOrder)

  if (language == DEUTSCH) {
    conv.add(`Ich habe ${latestOrder.quantity} Stück von ${latestOrder.item} von dem Korb entfernt`)
  } else {
    conv.add(`Ok, I have removed ${latestOrder.quantity} of ${latestOrder.item} from your cart`)
  }
  conv.request.session.params = null
})

app.handle('GetLatestOrderFromCart', async conv => {
  const language = conversationParser.getLanguage(conv)
  const clientId = conversationParser.getClientId(conv)
  const latestOrder = await orderService.getLatestOrderFromLatestCart(clientId)

  conv.session.params.order = JSON.stringify(latestOrder)
  if (language === DEUTSCH) {
    conv.add(`Willst du ${latestOrder.quantity} Stück von ${latestOrder.item} von dem Korb entfernen?`)
    conv.add(new Suggestion({ title: 'Ja'}))
    conv.add(new Suggestion({ title: 'Nein'}))
  } else {
    conv.add(`Do you want me to remove ${latestOrder.quantity} of ${latestOrder.item} from your cart?`)
    conv.add(new Suggestion({ title: 'Yes'}))
    conv.add(new Suggestion({ title: 'No'}))
  }
})

app.handle('CancelRemovalOfLastOrder', async conv => {
  const language = conversationParser.getLanguage(conv)
  if (language === DEUTSCH) {
    conv.add(`Ok, I werde es nicht entfernen.`)
  } else {
    conv.add(`Ok, I won't remove the item.`)
  }
  conv.request.session.params = null
})

app.handle('CancelNewOrder', async conv => {
  const language = conversationParser.getLanguage(conv)
  if (language === DEUTSCH) {
    conv.add(`Ok, ich habe die Bestellung abgesagt.`)
  } else {
    conv.add(`Ok, I have canceled your order.`)
  } 
  conv.request.session.params = null
})

app.handle('CancelRemoveOrder', async conv => {
  const language = conversationParser.getLanguage(conv)
  if (language === DEUTSCH) {
    conv.add(`Ok, ich habe die Entfernung abgesagt.`)
  } else {
    conv.add(`Ok, I have canceled the removal.`)
  }
  conv.request.session.params = null
})

app.handle('CommitNewOrder', async conv => {
  const language = conversationParser.getLanguage(conv)
  const clientId = conversationParser.getClientId(conv)
  const selectedOption = conv.request.scene.slots.ProductName.value
  const selectedQuantity = conv.request.session.params.quantity
  const unitOfMeasurement = conversationParser.getUnitOfMeasurementFromSession(conv, selectedOption)
  const matchCodeFromSession = conversationParser.getMatchCodeFromSession(conv, selectedOption)

  await orderService.addNewOrder(
    clientId, selectedOption, selectedQuantity, unitOfMeasurement, matchCodeFromSession
  )

  if (language === DEUTSCH) {
    conv.add(`Ich habe ${selectedQuantity} Stück von ${selectedOption} an dem Korb hinzugefügt`)
  } else {
    conv.add(`Ok, I have added ${selectedQuantity} of ${selectedOption} to the cart`)
  }
  conv.request.session.params = null
})

app.handle('CommitRemoveOrder', async conv => {
  const language = conversationParser.getLanguage(conv)
  const clientId = conversationParser.getClientId(conv)
  const orderToRemove = conv.request.session.params.order

  await orderService.removeOrderFromLatestCart(clientId, orderToRemove)

  if (language === DEUTSCH) {
    conv.add(`Ich habe ${selectedOption} an dem Korb hinzugefügt`)
  } else {
    conv.add(`Ok, I have removed ${orderToRemove.item} from the cart`)
  }
  conv.request.session.params = null
})

app.handle('AddOrderProductChosen', async conv => {
  const language = conversationParser.getLanguage(conv)
  const selectedOption = conv.request.scene.slots.ProductName.value
  const selectedQuantity = conv.request.session.params.quantity

  if (language === DEUTSCH) {
    conv.add(`Sie haben ${selectedQuantity} Stück von ${selectedOption} ausgewählt. Möchten Sie es in den Warenkorb hinzufügen?`)
    conv.add(new Suggestion({ title: 'Ja'}))
    conv.add(new Suggestion({ title: 'Nein'}))
  } else {
    conv.add(`You selected ${selectedQuantity} of ${selectedOption}. Would you like me to add it to the cart?`)
    conv.add(new Suggestion({ title: 'Yes'}))
    conv.add(new Suggestion({ title: 'No'}))
  }
})

app.handle('RemoveOrderProductChosen', async conv => {
  const language = conversationParser.getLanguage(conv)
  const selectedOption = conv.request.scene.slots.OrderName.value
  const order = conversationParser.getOrderByKeyTimestamp(conv, selectedOption)

  if (language === DEUTSCH) {
    conv.add(`Sie haben ${order.item} ausgewählt. Möchten Sie es von dem Warenkorb entfernen?`)
    conv.add(new Suggestion({ title: 'Ja'}))
    conv.add(new Suggestion({ title: 'Nein'}))
  } else {
    conv.add(`You selected ${order.item}. Would you like me to remove it to the cart?`)
    conv.add(new Suggestion({ title: 'Yes'}))
    conv.add(new Suggestion({ title: 'No'}))
  }
  conv.session.params = { order: order }
})

app.handle('AddOrderListProducts', async conv => {
  const language = conversationParser.getLanguage(conv)
  const matchCode = conv.request.intent.params.matchCode.resolved
  logger.info(`Match code is ${matchCode}`)
  console.log(JSON.stringify(conv, null, 2))
  // Override type based on slot 'prompt_option'
  const products = await productService.getProductsByMatchCode(matchCode)
  logger.info(products)

  if (products.length < 1) {
    if (language === DEUTSCH) {
      conv.add(`Es gibt kein ${matchCode} in der Datenbank`)
    } else {
      conv.add(`There is no ${matchCode} product in the database`)
    }
    return
  }

  let listTitle = 'List of items'
  if (language === DEUTSCH) {
    listTitle = 'Liste'
    conv.add('Wählen Sie aus den unten angezeigten Möglichkeiten')
  } else {
    conv.add('Choose from the options displayed below')
  }

  conv.session.params.quantity = conv.request.intent.params.quantity.resolved
  conv.session.params.options = products.map(product => {
    return {
      key: product.name,
      unit: product.UoM,
      matchCode: product.matchCode
    }
  })

  conv.session.typeOverrides = [{
    name: 'ProductChoice',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: products.map((product, index) => {
        return {
          name: product.name,
          display: {
            title: `${index + 1}) ${product.name}`,
            description: (language === DEUTSCH) ?
              `Lieferant: ${product.supplier}, Maßeinheit: ${product.UoM}`
              :
              `Supplier: ${product.supplier}, Unit of measurement: ${product.UoM}`
          },
          synonyms: [...deutschIndex[index]]
        }
      })
    }
  }]
  
  // Define prompt content using keys
  conv.add(new List({
    title: listTitle,
    items: products.map(product => { return { key: product.name } })
  }))
})

app.handle('RemoveOrderListCartContent', async conv => {
  const language = conversationParser.getLanguage(conv)
  const matchCode = conv.request.intent.params.productMatchCode.resolved
  logger.info(`Match code is ${matchCode}`)
  
  // Override type based on slot 'prompt_option'
  const clientId = conversationParser.getClientId(conv)
  const orders = await cartService.getOrdersFromLatestCartByMatchCode(clientId, matchCode)
  logger.info(orders)
  
  if (orders.length < 1) {
    if (language === DEUTSCH) {
      conv.add(`Leider gibt es ${matchCode} nicht in dem Korb`)
    } else {
      conv.add(`There is no ${matchCode} product in the cart.`)
    }
    return
  }

  let listTitle = 'List of items'
  if (language === DEUTSCH) {
    listTitle = 'Liste'
    conv.add('Wählen Sie aus den unten angezeigten Möglichkeiten')
  } else {
    conv.add('Choose from the orders displayed below')
  }

  conv.session.params.options = orders
  conv.session.typeOverrides = [{
    name: 'ProductChoice',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: orders.map((order, index) => {
        return {
          name: JSON.stringify({
            _seconds: order.timestamp._seconds,
            _nanoseconds: order.timestamp._nanoseconds
          }),
          display: {
            title: `${index + 1}) ${order.item}`,
            description: (language === DEUTSCH) ?
              `Quantity: ${order.quantity}, Unit of measurement: ${order.unit}, Created: ${order.timestamp.toDate()}`
              :
              `Quantität: ${order.quantity}, Maßeinheit: ${order.unit}, Erstellt: ${order.timestamp.toDate()}`
          },
          synonyms: [...deutschIndex[index]]
        }
      })
    }
  }]
  
  // Define prompt content using keys
  conv.add(new List({
    title: listTitle,
    items: orders.map(order => { return { key: JSON.stringify(order.timestamp) } })
  }))
})

module.exports = app;