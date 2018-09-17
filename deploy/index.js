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

const startConfig = () => {
    const env = process.env.NODE_ENV;
    let config = {}
    let dbConfig;

    switch (env) {
        case "development": 
            config = dev;
            dbConfig = dev.db;
        break;
        default: 
            config = local;
            dbConfig = local.db;
        break;
    }

    config.dbURI = getURI(dbConfig);
    return config;
}

module.exports = startConfig();