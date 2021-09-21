const UserSchema = require('../../models/User')
const response = require('../../lib/response');

class AuthController {

  // Create a new user
  async createUser(req, res) {
    try {
      const {
        fullname, 
        username, 
        password,
        confirmpassword,
        email,
        description,
        profession,
      } = req.body
      console.log(`DATA BODY
      |  fullname: ${fullname} 
      |  username:  ${username} 
      |  password: ${password} 
      |  confirm password: ${confirmpassword} 
      |  description: ${description} 
      |  profession: ${profession} 
        `);
      
      if (password !== confirmpassword) {
        return response.error(req, res, 'Password and confirm password does not match', 409)
      }

      const theUserExist = await UserSchema.findOne({username: username})
      if (theUserExist) {
        return response.error(req, res, 'User already exist', 409)
      } 
      
      const user = new UserSchema(req.body)
      const newUser = await user.save()
      response.success(req, res, newUser, 200)
    }catch(error) {
      console.log(error);
      response.error(req, res, error.message, 500)
    }
  }

  // Login a user
  async loginUser(req, res) {
    try {
      const {username, password} = req.body;

    }catch(error) {
      console.log(error);
    }
  }

}

const authController = new AuthController();
module.exports = authController;