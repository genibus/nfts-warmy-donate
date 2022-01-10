const DotEnv = require('dotenv')
const parsedEnv = DotEnv.config().parsed

module.exports = function () {
  // Let's stringify our variables
  return parsedEnv
}
