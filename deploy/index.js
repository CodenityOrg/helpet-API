const dev = require("./dev");
const local = require("./local");
const production = require("./production");

const getURI = ({ host, port, name, user = "", password = "" }) => {
    const uri = "mongodb://";
    port = port? `:${port}`: "";
    const defaultUri = `${host}${port}/${name}`;

    const hasCredentials = user && password;
    
    if (hasCredentials) {
        return `${uri}${user}:${password}@${defaultUri}`;
    }

    return `${uri}${defaultUri}`;
};

const environments = {
    development: dev,
    local,
    production
}

const startConfig = () => {
    const {NODE_ENV} = process.env;
    const config = environments[NODE_ENV] || local;
    const {db = local.db} = config;
    config.dbURI = getURI(db);
    return config;
}

module.exports = startConfig();