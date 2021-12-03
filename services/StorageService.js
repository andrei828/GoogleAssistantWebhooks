const Cart = require('../models/Cart')
const Order = require('../models/Order')
const Client = require('../models/Client')
const Product = require('../models/Product')

const { initializeApp, applicationDefault, cert } = require('firebase-admin/lib/app')
const { getFirestore, FieldValue } = require('firebase-admin/lib/firestore')

const serviceAccount = require('../confidentialdata.json')
initializeApp({ credential: cert(serviceAccount) })

const db = getFirestore();

class StorageService {
  constructor() {
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
      const carts = db.collection(client.id)
      const snapshot = await carts.orderBy('created', 'desc').limit(1).get()
      snapshot.forEach(doc => {
          const data = doc.data()
          return new Cart(client.id, data.orders, data.status)
      })
    } catch (e) {
      console.log(e)
    }
  }

  async getAllProducts() {
    try {
      const products = db.collection('products')
      const snapshot = await products.get()
      return snapshot.map(doc => {
          const data = doc.data()
          return new Product(data.name, data.display, data.synonyms)
      })
    } catch (e) {
      console.log(e)
    }
  }

  async getLatestCartContent(cart) {
    try {
      const cartDoc = db.collection(cart.clientId).doc(cart.id);
      const doc = await cartDoc.get()
      if (!doc.exists) {
        console.log(`No document with id ${cart.id} has been found in collection ${cart.clientId}`);
      } else {
        const orders = Array.from(doc.data().orders)
        if (orders.length === 0) {
          return null
        } else if (orders.length > 1) {
          orders.sort((a, b) => a.created.localeCompare(b.created));
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
        console.log(`No document with id ${cart.id} has been found in collection ${cart.clientId}`);
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

  async addNewCart(newCart) {
    try {
      const cartDoc = db.collection(newCart.clientId).doc(newCart.id);
      await cartDoc.set({
        created: newCart.timestamp,
        orders: newCart.orders,
        status: newCart.status
      })     
    } catch (e) {
      console.log(e)
    }
  }

  async removeCart(cart) {
    try {
      await db.collection(cart.clientId).doc(cart.id).delete();
    } catch (e) {
      console.log(e)
    }
  }

  async addOrderToCart(cart, order) {
    try {
      const cartDoc = db.collection(cart.clientId).doc(cart.id);
      await cartDoc.update({
        orders: FieldValue.arrayUnion(order)
      })     
    } catch (e) {
      console.log(e)
    }
  }

  async removeOrderFromCart(cart, order) {
    try {
      const cartDoc = db.collection(cart.clientId).doc(cart.id);
      await cartDoc.update({
        orders: FieldValue.arrayRemove(order)
      })     
    } catch (e) {
      console.log(e)
    }
  }
  

  /*
  Session queries region
  */
  async addSessionAndProductDocument(sessionId, product) {
    try {
      await db.collection('sessions').add({
        sessionId: sessionId,
        product: product
      })     
    } catch (e) {
      console.log(e)
    }
  }

  async getProductBySession(sessionId) {
    try {
      const citiesRef = db.collection('sessions');
      const snapshot = await citiesRef.where('sessionId', '==', sessionId).get();
      if (snapshot.empty) {
        console.log(`No matching documents with sessionId=${sessionId}`);
        return;
      }  

      snapshot.forEach(doc => {
        const data = doc.data()
        return data.product
      });
    } catch (e) {
      console.log(e)
    }
  }
}
  
module.exports = StorageService;