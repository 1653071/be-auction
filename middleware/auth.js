// const jwt= require('jsonwebtoken');


// const express = require('express')
// const router = express.Router()
// module.exports.auth = function (req, res, next) {
//   const accessToken = req.headers["x-access-token"];
//   if (accessToken) {
//     try {
//       const decoded = jwt.verify(accessToken, 'SECRET_KEY');
//       console.log(decoded);
//       req.accessTokenPayload = decoded;
//       next();
//     } catch (err) {
//       var err = new Error('Not authorized! Go back!');
//       err.status = 401;
//       return next(err);
//     }
//   } else {
//     var err = new Error('Not authorized! Go back!');
//       err.status = 401;
//       return next(err);
//   }
// };
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, 'SECRET_KEY');
      // console.log(decoded);
      req.accessTokenPayload = decoded;
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        message: 'Invalid access token.'
      });
    }
  } else {
    return res.status(401).json({
      message: 'Access token not found.'
    });
  }
};
