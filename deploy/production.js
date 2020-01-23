module.exports = {
  port: process.env.port,
  db: {
    host: process.env.DBHOST,
    name: process.env.DBNAME,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD
  }
};
