const express = require('express')
const bodyParser = require('body-parser')
const app = require('./handlers/assistantConversationHandlers')


// Express.js linking
const expressApp = express().use(bodyParser.json())
expressApp.post('/assistant', app)

// expressApp.get('/', async function (req, res) {
//     const Cart = require('./models/Cart')
//         const Client = require('./models/Client')
//         const StorageService = require('./services/StorageService')
//         const storageService = new StorageService(null)
//         // const cart = await storageService.getLatestCart(new Client("lab1"))

//         // console.log(cart)
//         console.log(await storageService.getProductsByMatchCode("Deckel"))
//   })



expressApp.listen(8080, () => console.log("Listening on port 8080..."))