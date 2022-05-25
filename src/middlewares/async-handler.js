// router에 try-catch 구문 수행할 middleware
function asyncHandler (requestHandler) {
    return async (req, res, next) => {
      try {
          await requestHandler(req, res);
      } catch (err) {
          next(err);
      }
    }
  };

  export { asyncHandler };