const admin = require('firebase-admin')

class Order {
  constructor(item, quantity, unit, matchCode, timestamp) {
    this.item = item
    this.unit = unit
    this.quantity = quantity
    this.matchCode = matchCode
    this.timestamp = Object.freeze((timestamp === undefined) ? admin.firestore.Timestamp.now() : timestamp)
  }
}
    
module.exports = Order;