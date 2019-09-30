const Notification = require("../models/Notification");


module.exports = {

  async create (req) {
    const { post, sender, receiver, fullName } = req;
    const notification = { post, sender, receiver, fullName };
    const NewNotification = await Notification.create(notification);
    await NewNotification.save();

  },
  async list(req, res) {
    try {
      const { id } = req.body;
      const notifications = await Notification.find( { receiver: id } );
      return res.json(notifications);
    } catch (e) {
      return res.sendStatus(500);
    }
  }
}
