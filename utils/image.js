
const filestack = require("filestack-js");
const apikey = "A8iI1dUWyQrxGIK4XnaJqz";
const client = filestack.init(apikey);

module.exports = {
    upload: async (file) => await client.upload(file)
};