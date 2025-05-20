const { CLIENT_URL } = require('../config/configuration');
const { generateToken } = require('../utils/jwt');

const googleCallback = (req, res) => {

  const user = req.user;
  
  console.log("req.use", req.user)

  const token = generateToken(user);
  const isAdmin = req.user.isAdmin;
 
  console.log(user)

  console.log(token)

  res.redirect(`${CLIENT_URL}/callback?token=${token}&isAdmin=${isAdmin}`)

};

const failure = (req, res) => {
  res.send('Failed...!');
};

module.exports = { googleCallback, failure };