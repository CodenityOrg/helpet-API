const Notification = require("../models/Notification");


module.exports = {
	async list(req, res) {
		try {
			const { user: { _id: userId } } = req.headers;
			const notifications =
					await Notification.find( { receiver: userId } )
					.populate({
						path: "post",
						populate: [
							{
								path: "tags",
								model: "Tag"
							},
							{
								path: "photos",
								model: "Photo"
							},
							{
								path: "user",
								model: "User"
							}
						]
					})
					.populate("sender", {firstName:1, lastName: 1, email: 1, profile: 1})
					.sort({ createdAt: "desc" })
					.exec();

			const unread = await Notification.count({ receiver: userId, read: false });

			return res.json({
				notifications,
				unread
			});
		} catch (e) {
			return res.sendStatus(500);
		}
	},
	async read(req, res) {
		try {
			const {id} = req.params;
			const notification = await Notification.findById(id);
			notification.read = true;
			await notification.save();
			res.json(notification);
		} catch (e) {
			return res.sendStatus(500);
		}
	}
}
