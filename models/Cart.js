const { database } = require('firebase-admin')

class Cart {
  constructor(id, clientId, orders=[], status=CartStatus.Open, timestamp=null) {
    this.id = id
    this.clientId = clientId
    this.orders = orders
    this.status = status
    this.timestamp = (timestamp === null) ? database.ServerValue.TIMESTAMP : timestamp
  }
}

// Open    - Free to add items
// Pending - Closed has been sent to the seller
// Closed  - Orders from the cart have been served
const CartStatus = Object.freeze({"Open": 1, "Pending": 2, "Closed": 3,})
    
module.exports = Cart;