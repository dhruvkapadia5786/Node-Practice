const passport = require('passport');
const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: '1h' });
};

module.exports = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      console.error(err);  // Log the error
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const currentTime = Date.now() / 1000;
    const tokenExpiration = user.exp;

    if (tokenExpiration - currentTime < 60) {
      const accessToken = generateAccessToken(user);
      res.header('New-Access-Token', accessToken);
    }

    next();
  })(req, res, next);
};
