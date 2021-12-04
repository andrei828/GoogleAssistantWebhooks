const Cart = require('../models/Cart')
const Order = require('../models/Order')
const Client = require('../models/Client')
const Product = require('../models/Product')
const CartStatus = require('../models/CartStatus')

const admin = require('firebase-admin')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/lib/app')
const { getFirestore, FieldValue } = require('firebase-admin/lib/firestore')

const serviceAccount = require('../confidentialdata.json')
initializeApp({ credential: cert(serviceAccount) })

const db = getFirestore();

class StorageService {
  constructor(logger) {
    this._logger = logger
  }

  /*
  Client queries region
  */
  async getCartsByClient(client) {
    try {
      const carts = db.collection(client.id)
      const snapshot = await carts.get()
      return snapshot.map(doc => {
        const data = doc.data()
        return new Cart(client.id, data.orders, data.status)   
      })
    } catch (e) {
      console.log(e)
    }
  }

  async getLatestCart(client) {
    try {
      let result = null
      const carts = db.collection(client.id)
      const snapshot = await carts.orderBy('created', 'desc').limit(1).get()
      snapshot.forEach(doc => {
        const data = doc.data()
        result = new Cart(doc.id, client.id, data.orders, data.status)
        return
      })
      return result

    } catch (e) {
      console.log(e)
    }
  }

  async getAllProducts() {
    try {
      let result = []
      const products = db.collection('productsDe')
      const snapshot = await products.get()
      snapshot.forEach(doc => {
        const data = doc.data()
        result.push(new Product(data.Name, data.Supplier, data.MatchCode, data.UoM))
      })
      return result

    } catch (e) {
      console.log(e)
    }
  }

  async getProductsByMatchCode(matchCode) {
    try {
      let result = []
      const products = db.collection('productsDe')
      const snapshot = await products.where('Matchcode', '==', matchCode).get()
      snapshot.forEach(doc => {
        const data = doc.data()
        result.push(new Product(data.Name, data.Supplier, data.Matchcode, data.UoM))
      })
      return result

    } catch (e) {
      console.log(e)
    }
  }

  async getLatestCartContent(cart) {
    try {
      const cartDoc = db.collection(cart.clientId).doc(cart.id)
      const doc = await cartDoc.get()
      if (!doc.exists) {
        console.log(`No document with id ${cart.id} has been found in collection ${cart.clientId}`)
      } else {
        const orders = Array.from(doc.data().orders)
        if (orders.length === 0) {
          return null
        } else if (orders.length > 1) {
          orders.sort((a, b) => a.created.localeCompare(b.created))
        }
        return orders[0]
      }
    } catch (e) {
      console.log(e)
    }
  }

  async getOrdersByCart(cart) {
    try {
      const cartDoc = db.collection(cart.clientId).doc(cart.id);
      const doc = await cartDoc.get()
      if (!doc.exists) {
        console.log(`No document with id ${cart.id} has been found in collection ${cart.clientId}`)
      } else {
        const data = doc.data()
        return data.orders.map(
          order => new Order(order.name, order.quantity, order.unit, order.created)
        )
      }
    } catch (e) {
      console.log(e)
    }
  }

  async addNewCart(clientId, newCart) {
    try {
      const cartDoc = db.collection(clientId).doc(newCart.id)
      await cartDoc.set({
        created: newCart.timestamp,
        orders: newCart.orders,
        status: newCart.status
      })     
    } catch (e) {
      console.log(e)
    }
  }

  async closeCurrentCart(clientId) {
    try {
      const cartDoc = db.collection(clientId).where('status', '==', CartStatus.Open)
      await cartDoc.update({
        status: CartStatus.Closed
      }, { merge: true })    
    } catch (e) {
      console.log(e)
    }
  }

  async removeCart(cart) {
    try {
      await db.collection(cart.clientId).doc(cart.id).delete()
    } catch (e) {
      console.log(e)
    }
  }

  async addOrderToCart(clientId, order) {
    try {
      await db
        .collection(clientId)
        .where('status', '==', 'Open')
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(document) {
            document.ref.update({
              orders: FieldValue.arrayUnion({
                item: order.item,
                unit: order.unit,
                quantity: order.quantity,
                timestamp: admin.firestore.Timestamp.now()
              })
            }, { merge: true })
          })
        })   
    } catch (e) {
      console.log(e)
    }
  }

  async removeOrderFromCart(clientId, order) {
    try {
      await db
        .collection(clientId)
        .where('status', '==', 'Open')
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(document) {
            document.ref.update({
              orders: FieldValue.arrayRemove({
                item: order.item,
                unit: order.unit,
                quantity: order.quantity,
                timestamp: admin.firestore.Timestamp.now()
              })
            }, { merge: true })
          })
        })     
    } catch (e) {
      console.log(e)
    }
  }
  
  async getLatestOrderFromLatestCart(clientId) {
    try {
      const cartDoc = db.collection(clientId).where('status', '==', CartStatus.Open)
      const doc = await cartDoc.get()
      if (!doc.exists) {
        console.log(`No document has been found in collection ${clientId}`);
      } else {
        const orders = Array.from(doc.data().orders)
        if (orders.length === 0) {
          return null
        } else if (orders.length > 1) {
          orders.sort((a, b) => { if (a > b) { return 1 } else { return -1 } })
        }
        return orders[0]
      }
    } catch (e) {
      console.log(e)
    }
  }

  /*
  Session queries region
  */
  async addSessionAndOrderDocument(sessionId, item) {
    try {
      await db.collection('sessions').add({
        sessionId: sessionId,
        item: item
      })     
    } catch (e) {
      console.log(e)
    }
  }

  async getOrderBySession(sessionId) {
    try {
      const citiesRef = db.collection('sessions');
      const snapshot = await citiesRef.where('sessionId', '==', sessionId).get();
      if (snapshot.empty) {
        console.log(`No matching documents with sessionId=${sessionId}`);
        return;
      }  

      snapshot.forEach(doc => {
        const data = doc.data()
        return data.item
      });
    } catch (e) {
      console.log(e)
    }
  }

  async deleteSession(sessionId) {
    try {
      await db.collection('sessions').where('sessionId', '==', sessionId).delete();
    } catch (e) {
      console.log(e)
    } 
  }
}
  
module.exports = StorageService;