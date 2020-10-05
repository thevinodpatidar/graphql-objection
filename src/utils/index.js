const jwt = require('jsonwebtoken')
const CONFIG = require("../config/index");
const signToken = id => {
  return new Promise(resolve => {
    resolve(jwt.sign({ id: id }, CONFIG.JWT_SECRET))
  })
}
const verifyJwt = req => {
  let token
  if (req.query && req.query.hasOwnProperty('access_token')) {
    token = req.query.access_token
  } else if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  // console.log(token);
  return new Promise((resolve, reject) => {
    jwt.verify(token, CONFIG.JWT_SECRET, (error, decoded) => {
      if (error) reject('401: User is not authenticated')
      resolve(decoded)
    })
  })
}
module.exports = { signToken, verifyJwt }