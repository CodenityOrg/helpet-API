const Notification = require("../models/Notification");


module.exports = {
	async list(req, res) {
		try {
			const { id } = req.params;
			const notifications =
					await Notification.find( { receiver: id } )
					.populate("post")
					.populate("sender", {firstName:1, lastName: 1, email: 1, profile: 1});

			return res.json(notifications);
		} catch (e) {
			return res.sendStatus(500);
		}
	}
}
