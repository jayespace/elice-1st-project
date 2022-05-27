import jwt from 'jsonwebtoken';

function adminRequired(req, res, next) {

  if (!req.currentUserRole || req.currentUserRole === 'null' || req.currentUserRole !== 'admin') {
    console.log('관리자 요청이 있었습니다. 하지만 권한이 없거나 적절하지 않습니다.');
    res.status(403).json({
      result: 'forbidden-approach',
      reason: '관리자만 사용할 수 있는 서비스입니다.',
    });

    return;
  }
  next();
}

export { adminRequired };
