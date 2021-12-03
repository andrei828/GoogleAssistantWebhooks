const express = require('express')
const bodyParser = require('body-parser')
// const app = require('./handlers/assistantConversationHandlers')




// Express.js linking
const expressApp = express().use(bodyParser.json())
// expressApp.post('/assistant', app)

expressApp.get('/', async function (req, res) {
    const Cart = require('./models/Cart')
        const Client = require('./models/Client')
        const StorageService = require('./services/StorageService')
        const storageService = new StorageService()
        await storageService.getLatestCart(new Client("lab1"))
  })
// (async () => {
//     try {
        
//     } catch (e) {
//         console.log(e)
//         // Deal with the fact the chain failed
//     }
// })();



expressApp.listen(8080)