const passport = require('passport');

const kakao = require('./strategies/kakao');

module.exports = () => {
  passport.use(kakao);
};