/* eslint-disable camelcase */
const { key_secret } = require('../config/config')
const jwt = require('jsonwebtoken')

const helpers = {
  /**
   * @description - This function is used to valid is an email
   * @returns {boolean} - returns if the email is valid or not
   **/
  isEmail: function (value) {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
  },

  istheUserAuthorized: (authorization) => {
    try {
      let token = null
      if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7)
      }
      const decodedToken = jwt.verify(token, key_secret)

      if (!token || !decodedToken.id) return false
      return decodedToken
    } catch (error) {
      return false
    }
  }
}

module.exports = helpers
