const User = require("../models/User");

module.exports = function (io) {
    io.on('connection', function(socket) {
        global.io = io;
        /* socket.on('updateId', async (data) => {
            const user = await User.findById(data.userId);
            user.receiverId = socket.id;
            await user.save();
        }); */
    });
}