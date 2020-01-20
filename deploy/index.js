const dev = require("./development");
const local = require("./local");
const production = require("./production");
const stage = require("./stage");

const getURI = ({ host, port, name, user = "", password = "" }) => {
    const uri = "mongodb://";
    // eslint-disable-next-line no-param-reassign
    port = port ? `:${port}` : "";
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
    production,
    stage
}

const startConfig = () => {
    const { NODE_ENV } = process.env;
    const config = environments[NODE_ENV] || local;
    const { db = local.db } = config;
    config.dbURI = getURI(db);
    return config;
};

module.exports = startConfig();
