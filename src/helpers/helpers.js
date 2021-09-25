const helpers = {
  /**
   * @description - This function is used to valid is an email
   * @returns {boolean} - returns if the email is valid or not
   **/
  isEmail: function(value) {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
  }
}

module.exports = helpers
