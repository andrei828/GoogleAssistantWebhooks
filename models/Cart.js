const { database } = require('firebase-admin')
const CartStatus = require('./CartStatus')

class Cart {
  constructor(id, clientId, orders=[], status=CartStatus.Open, timestamp=null) {
    this.id = id
    this.clientId = clientId
    this.orders = orders
    this.status = status
    this.timestamp = (timestamp === null) ? database.ServerValue.TIMESTAMP : timestamp
  }
}
    
module.exports = Cart;