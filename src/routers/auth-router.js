import jwt from 'jsonwebtoken';
import { Router } from 'express';
import passport from 'passport';

const authRouter = Router();
const userTokenAndInfo ={};


authRouter.get('/kakao', passport.authenticate('kakao'));

authRouter.get('/kakao/callback', passport.authenticate('kakao', { session: false }), (req, res, next) => {
  const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
  const user = req.user;
  const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);
  userTokenAndInfo.token =  token; 
  userTokenAndInfo.user = user;
  res.cookie('userTokenAndInfo', userTokenAndInfo)
  res.redirect('http://localhost:5000/oauth');
});


export { authRouter };