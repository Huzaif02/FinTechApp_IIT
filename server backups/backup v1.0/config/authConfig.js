module.exports = {
    jwt: {
      secret: process.env.JWT_SECRET || 'your_jwt_secret',
      expiresIn: '1d', // Token validity duration
    },
    bcrypt: {
      saltRounds: 10, // Number of salt rounds for hashing passwords
    },
  };
  