const express = require('express')
const bodyParser = require('body-parser')
const app = require('./handlers/assistantConversationHandlers')


// Express.js linking
const expressApp = express().use(bodyParser.json())
expressApp.post('/assistant', app)



expressApp.listen(8080, () => console.log("Listening on port 8080..."))