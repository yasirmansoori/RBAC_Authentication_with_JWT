const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const InvalidatedToken = require('../models/tokens.model');


module.exports = {
  // This function will generate a new access token and return it
  signAccessToken: (userId, role) => {
    return new Promise((resolve, reject) => {
      const payload = {
        role: role
      };
      const secret = process.env.SECRET_KEY;
      const options = {
        expiresIn: '1d',
        issuer: 'localhost',
        audience: userId
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
        }
        resolve(token);
      })
    })
  },
  // This function will generate a new refresh token and return it
  signRefreshToken: (userId, role) => {
    return new Promise((resolve, reject) => {
      const payload = {
        role: role
      };
      const secret = process.env.SECRET_KEY;
      const options = {
        expiresIn: '10d',
        issuer: 'localhost',
        audience: userId
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
        }
        resolve(token);
      })
    })
  },
  // This function will verify the access token and return the payload if it is valid
  verifyAccessToken: (req, res, next) => {
    // If the token is retrieved from the authorization header, then use this code ------>
    // if (!req.headers['authorization']) return next(createError.Unauthorized());
    // const authHeader = req.headers['authorization'];
    // const bearerToken = authHeader.split(' ');
    // const token = bearerToken[1];
    // ---------------------->
    // If the token is retrieved from the cookie, then use this code ------>
    if (!req.cookies.access_token) return next(createError.Unauthorized());
    const token = req.cookies.access_token;
    JWT.verify(token, process.env.SECRET_KEY, (err, payload) => {
      if (err) {
        const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
        return next(createError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    })
  },
  // Verify refresh token from database
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      // Check if the token is invalidated by looking in the database
      InvalidatedToken.findOne({ token: refreshToken }).then((invalidatedToken) => {
        if (invalidatedToken) {
          return reject(createError.Unauthorized('Uhh oh! You are a trespasser! Please login again.'));
        }

        JWT.verify(refreshToken, process.env.SECRET_KEY, (err, payload) => {
          if (err) return reject(createError.Unauthorized());
          const userId = payload.aud;
          resolve(userId);
        });
      }).catch((err) => {
        reject(createError.InternalServerError('Error verifying token'));
      });
    });
  },
  // Invalidate refresh token in the database
  invalidateRefreshToken: (refreshToken, userId) => {
    const invalidatedToken = new InvalidatedToken({
      token: refreshToken,
      user_id: userId,
      invalidated_at: new Date(),
    });

    invalidatedToken.save()
      .then(() => {
        console.log(`Token invalidated for user ${userId}`);
      })
      .catch((err) => {
        console.error('Error saving invalidated token:', err);
      });
  }
}