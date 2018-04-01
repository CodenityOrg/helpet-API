const admin = require("firebase-admin");

const serviceAccount = require("../miclas-dd113-firebase-adminsdk-x86xt-d35327314e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://miclas-dd113.firebaseio.com"
});

const app = admin.messaging();

module.exports = {
    sendNotification(token, data) {
        return app.sendToDevice(token, data);
    }
}