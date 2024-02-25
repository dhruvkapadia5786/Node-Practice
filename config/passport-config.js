
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/user');

const saltRounds = 10;

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'Incorrect email' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
  expiresIn: '1h',  // Access token expiration time
  refreshExpiresIn: '7d'  // Refresh token expiration time
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload._id);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);
