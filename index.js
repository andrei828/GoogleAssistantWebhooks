const express = require('express')
const bodyParser = require('body-parser')
const {
    conversation,
    Image,
    List,
} = require('@assistant/conversation')

const OrderService = require('./services/OrderService')
const orderService = new OrderService()

// Create an app instance
const app = conversation()

// Google Assistant handlers
const ASSISTANT_LOGO_IMAGE = new Image({
  url: 'https://developers.google.com/assistant/assistant_96.png',
  alt: 'Google Assistant logo'
});
  
app.handle('Response', conv => {
  console.log(conv)
});

app.handle('Option', conv => {
  const selectedOption = conv.request.scene.slots.type_option.value
  const sessionID = conv.request.session.id

  orderService.addNewOrder(selectedOption, sessionID)
  conv.add(`You selected ${selectedOption}. Would you like me to add it to the cart?`)
});

app.handle('Yes', conv => {
  // Note: 'prompt_option' is the name of the slot.
  /*console.log("Yes confirmation")
  console.log(JSON.stringify(conv, null, 2))*/

  const sessionID = conv.request.session.id
  orderService.confirmOrder(sessionID)
  orderService.sendOrder(sessionID)
  const selectedOption = conv.request.scene.slots.type_option.value
  conv.add(`Ok, I have added ${selectedOption} to the cart`)
});

app.handle('List', conv => {
  conv.add('This is a list.');

  // Override type based on slot 'prompt_option'
  conv.session.typeOverrides = [{
    name: 'prompt_option',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: [
        {
          name: 'ITEM_1',
          synonyms: ['Item 1', 'First item'],
          display: {
              title: 'Item #1',
              description: 'Description of Item #1',
              image: ASSISTANT_LOGO_IMAGE,
                }
        },
        {
          name: 'ITEM_2',
          synonyms: ['Item 2', 'Second item'],
          display: {
              title: 'Item #2',
              description: 'Description of Item #2',
              image: ASSISTANT_LOGO_IMAGE,
                }
        },
        {
          name: 'ITEM_3',
          synonyms: ['Item 3', 'Third item'],
          display: {
              title: 'Item #3',
              description: 'Description of Item #3',
              image: ASSISTANT_LOGO_IMAGE,
                }
        },
        {
          name: 'ITEM_4',
          synonyms: ['Item 4', 'Fourth item'],
          display: {
              title: 'Item #4',
              description: 'Description of Item #4',
              image: ASSISTANT_LOGO_IMAGE,
                }
        },
        ]
    }
  }];

  // Define prompt content using keys
  conv.add(new List({
    title: 'List title',
    subtitle: 'List subtitle',
    items: [
      {
        key: 'ITEM_1'
      },
      {
        key: 'ITEM_2'
      },
      {
        key: 'ITEM_3'
      },
      {
        key: 'ITEM_4'
      }
    ],
  }));
});


// Express.js linking
const expressApp = express().use(bodyParser.json())
expressApp.post('/fulfillment', app)
expressApp.listen(8080)