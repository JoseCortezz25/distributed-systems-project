const jwt = require('jsonwebtoken')
const config = require('../../config/config')

const sign = (data) => {
  return jwt.sign(data, config.secret)
}

module.exports = { sign }
