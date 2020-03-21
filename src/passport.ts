import passport from 'passport';
import passportLocal from "passport-local";


// const OAuth2Strategy = require('passport-oauth2');
// const OAuth2RefreshTokenStrategy = require('passport-oauth2-middleware').Strategy;
import passportJwt from "passport-jwt";

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

import config from 'config';

const cipher = require('./api/common/auth/cipherHelper');
import {UserService} from './api/common/user/userService';

const userService = new UserService();

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
(email: string, password: string, cb: any) => {
  userService
    .findByEmail(email)
    .then((user: any) => {
      const { passwordHash } = cipher.sha512(password, user.salt);

      if (!user || user.passwordHash !== passwordHash) {
        return cb(null, false, { message: 'Incorrect utils or password.' });
      }

      return cb(null, { id: user._id, role: user.role }, { message: 'Logged In Successfully' });
    })
    .catch(() => cb(null, false, { message: 'Incorrect utils or password.' }));
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('auth.jwt.accessTokenSecret'),
},
(jwtPayload, cb) => {
  return cb(null, jwtPayload);
}));
