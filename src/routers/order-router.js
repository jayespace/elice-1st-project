import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../middlewares';
import { adminRequired } from '../middlewares';
import { asyncHandler } from '../middlewares';
import { orderService } from '../services';

const orderRouter = Router();

// admin 확인 후 모든 주문 정보를 가져옴
orderRouter.get('/orders/admin', loginRequired, adminRequired, asyncHandler(async (req, res) => {
  const orders = await orderService.getOrders();
  res.status(200).json(orders);
}));

// 로그인 한 User의 주문 정보를 가져옴
orderRouter.get('/orders', loginRequired, asyncHandler(async (req, res) => {
  const userId = req.currentUserId;
  const orders = await orderService.getOrdersByUser(userId);
  res.status(200).json(orders);
}));

// 주문 id로 검색 후 상세 정보 가져옴
orderRouter.get('/orders/:orderId', loginRequired, asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.getOrder(orderId);
  res.status(200).json(order);
}));

// 로그인 후 주문 추가
orderRouter.post('/orders', loginRequired, asyncHandler(async(req,res) => {

  // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
  if (is.emptyObject(req.body)) {
    throw new Error(
    'headers의 Content-Type을 application/json으로 설정해주세요'
    );
  }

  const userId = req.currentUserId;

  const {
    fullNameTo,
    phoneNumberTo,
    addressTo,
    messageTo,
    orderedProducts
  } = req.body;

  const newOrder = await orderService.addOrder(
    {
      user_id: userId,
      fullNameTo,
      phoneNumberTo,
      addressTo,
      messageTo,
      orderedProducts
    });
  res.status(201).json(newOrder);
}));


// 로그인 후 admin일 경우 주문 정보 수정
orderRouter.patch('/orders/:orderId', loginRequired, adminRequired, asyncHandler(async (req, res) => {

  // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
  if (is.emptyObject(req.body)) {
    throw new Error(
    'headers의 Content-Type을 application/json으로 설정해주세요'
    );
  }

  const { orderId } = req.params;
  const {
    fullNameTo,
    phoneNumberTo,
    addressTo,
    messageTo,
    orderedProducts
  } = req.body;

  // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
  // 보내주었다면, 업데이트용 객체에 삽입함.
  const toUpdate = {
    ...(fullNameTo && { fullNameTo }),
    ...(phoneNumberTo && { phoneNumberTo }),
    ...(addressTo && { addressTo }),
    ...(messageTo && { messageTo }),
    ...(orderedProducts && { orderedProducts })
  };
  // 상품 정보를 업데이트함.
  const updatedorderInfo = await orderService.setOrder(orderId, toUpdate);

  // 업데이트 이후의 데이터를 프론트에 보내 줌
  res.status(200).json(updatedorderInfo);
}));

export { orderRouter };