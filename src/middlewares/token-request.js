function tokenMatchRequest(req, res, next) {

    if (req.currentUserId !== req.params.userId) {
      console.log('사용자 요청이 있었습니다. 하지만 권한이 없거나 적절하지 않습니다.');
      res.status(403).json({
        result: 'forbidden-approach',
        reason: '로그인된 유저는 요청할 수 있는 권한이 없습니다.',
      });
  
      return;
    }
    next();
  }
  
  export { tokenMatchRequest };