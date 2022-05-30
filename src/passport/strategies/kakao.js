const KakaoStrategy = require('passport-kakao').Strategy;
import { model } from 'mongoose';
import { UserSchema } from '../../db/schemas/user-schema';

const User = model('users', UserSchema);

const config = {
  clientID: process.env.KAKAO_ID, // 카카오 로그인에서 발급받은 REST API 키
  callbackURL: '/api/auth/kakao/callback', // 카카오 로그인 Redirect URI 경로
};

async function findOrCreateUser(email, fullName) {
  
  const user = await User.findOne({ email:email });

  if (user) { 
    return user;
  }

  const created = await User.create({
    fullName:fullName,
    email:email,
    password: 'Kakao_OAUTH',  //나중에 random password로 바꾸고 비밀번호를 찾고싶으면
                              //비밀번호 분실 로직은 사용하여 찾을 수 있게 하자....
  });

  return created;
}

module.exports = new KakaoStrategy(config, async (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  const email = profile._json && profile._json.kakao_account.email;
  const fullName = profile.displayName;

  try {
    const user = await findOrCreateUser(email, fullName)
    done(null, user);
  } catch (e) {
    done(e, null);
  }
});