const fs = require('fs')
const os = require("os")
const admin = require('firebase-admin')

class Order {
  constructor(item, quantity, unit, timestamp=null) {
    this.item = item
    this.unit = unit
    this.quantity = quantity
    this.timestamp = (timestamp === null) ? admin.firestore.Timestamp.now() : timestamp
  }

  async send() {
    try {
      const timestamp = new Date().toISOString();
      await fs.appendFile('orders.txt', `${timestamp}: Ordered ${this.item.name}. Quantity: ${this.quantity}` + os.EOL, () => {
        console.log('Successfully placed the order!')
      })

      const docRef = db.collection('orders').doc(`order-${timestamp}`);
      await docRef.set({
        name: this.item.name,
        quantity: this.quantity
      });
    } catch (error) {
      console.error(error);
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }
  }
}
    
module.exports = Order;