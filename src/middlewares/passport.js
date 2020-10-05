'use strict';

const CONFIG = require('../global_constants');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const user = require('../models/user/userModel');

module.exports = function(passport) {

  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  //console.log(opts.jwtFromRequest);

  opts.secretOrKey = CONFIG.jwt_encryption;
  opts.passReqToCallback = true;

  passport.use(new JwtStrategy(opts, async function(req, jwt_payload, done) {
    let token = req.headers.authorization.split(' ')[1];
    let auth_token;

    console.log(jwt_payload.id);
    auth_token = await user.query().where('token', token).skipUndefined().andWhere('id', jwt_payload.id).first();
    if (auth_token) {
      // req.token = token;
      return done(null, auth_token);
    } else {
      return done(null, false);
    }

  }));
}
