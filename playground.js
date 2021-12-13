const admin = require('firebase-admin')
const Order = require('./models/Order')

console.log(admin.firestore.Timestamp.now().toDate())
