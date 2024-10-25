const serverless = require("serverless-http");
const bootstrap = require("./app/bootstrap/init")

// start listening
module.exports.handler = serverless(bootstrap);