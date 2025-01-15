module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: '1d', // Token validity (1 day)
  },
};