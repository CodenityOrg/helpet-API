const admin = require("firebase-admin");

const serviceAccount = require("../helpet-df2b6-firebase-adminsdk-byilp-79830c84db.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = admin.messaging();

module.exports = {
  sendNotification(tokens, data) {
    return app.sendToDevice(tokens, data);
  }
};
