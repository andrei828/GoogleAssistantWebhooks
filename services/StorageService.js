const Cart = require('../models/Cart')
const Order = require('../models/Order')
const Client = require('../models/Client')
const Product = require('../models/Product')
const CartStatus = require('../models/CartStatus')

const { initializeApp, applicationDefault, cert } = require('firebase-admin/lib/app')
const { getFirestore, FieldValue } = require('firebase-admin/lib/firestore')

const serviceAccount = require('../confidentialdata.json')
const { firestore } = require('firebase-admin')
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

  async getLatestCartContent(clientId) {
    try {
      const documentOrders = []
      await db
        .collection(clientId)
        .where('status', '==', 'Open')
        .get()
        .then(function (snapshot) {
          if (snapshot.empty) {
            console.log(`No document has been found in collection ${clientId}`)
            return
          }

          snapshot.forEach(doc => {
            const orders = Array.from(doc.data().orders)
            if (orders.length === 0) {
              return null
            }
            orders.forEach(order => {
              documentOrders.push(
                new Order(
                  order.name, 
                  order.quantity,
                  order.unit,
                  order.matchCode,
                  order.created,
                )
              )
            })
          })
        })
      return documentOrders
    } catch (e) {
      console.log(e)
    }
  }

  async getOrdersFromLatestCartByMatchCode(clientId, matchCode) {
    try {
      const documentOrders = []
      await db
        .collection(clientId)
        .where('status', '==', 'Open')
        .get()
        .then(function (snapshot) {
          if (snapshot.empty) {
            console.log(`No document has been found in collection ${clientId}`)
            return
          }

          snapshot.forEach(doc => {
            const orders = Array.from(doc.data().orders)
            if (orders.length === 0) {
              return null
            }
            orders.forEach(order => {
              if (order.matchCode == matchCode) {
                documentOrders.push(
                  new Order(
                    order.name, 
                    order.quantity,
                    order.unit,
                    order.matchCode,
                    order.created
                  )
                )
              }
            })
          })
        })
      return documentOrders
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
          order => new Order(order.name, order.quantity, order.unit, order.matchCode, order.created)
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
      const cartDoc = db.collection(clientId).where('status', '==', 'Open')
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
                name: order.item,
                unit: order.unit,
                quantity: order.quantity,
                matchCode: order.matchCode,
                created: order.timestamp
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
          const orderToRemove = {
            name: order.item,
            unit: order.unit,
            quantity: order.quantity,
            matchCode: order.matchCode,
            created: new firestore.Timestamp(order.timestamp._seconds, order.timestamp._nanoseconds)
          }
          console.log(`Want to remove this order: ${JSON.stringify(orderToRemove, null, 2)}`)
          querySnapshot.forEach(function(document) {
            document.ref.update({
              orders: FieldValue.arrayRemove(orderToRemove)
            }, { merge: true })
          })
        })     
    } catch (e) {
      console.log(e)
    }
  }
  
  async getLatestOrderFromLatestCart(clientId) {
    try {
      const documentOrders = []
      await db
        .collection(clientId)
        .where('status', '==', 'Open')
        .get()
        .then(function (snapshot) {
          if (snapshot.empty) {
            console.log(`No document has been found in collection ${clientId}`)
            return
          }

          snapshot.forEach(doc => {
            const orders = Array.from(doc.data().orders)
            if (orders.length === 0) {
              return null
            } else if (orders.length > 1) {
              orders.sort((a, b) => { if (a.created < b.created) { return 1 } else { return -1 } })
            }
            documentOrders.push(
              new Order(
                orders[0].name, 
                orders[0].quantity,
                orders[0].unit,
                orders[0].matchCode,
                orders[0].created
              )
            )
          })
        })

      if (documentOrders.length < 1) {
        return null
      }
      return documentOrders[0]

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