import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired, asyncHandler } from '../middlewares';
import { orderService, csStatusService, orderStatusService } from '../services';

const orderRouter = Router();

// admin은 모든 주문 정보를, 로그인 한 User는 본인의 주문 정보를 가져옴
orderRouter.get('/orders', loginRequired, asyncHandler(async (req, res) => {

  /// 현재 로그인 된 사람이 admin인지 확인
  const role = req.currentUserRole;
  const currentUserId = req.currentUserId;

  let orders;
  if (role === "admin") {
    orders = await orderService.getOrders();
  } else {  
    orders = await orderService.getOrdersByUser(currentUserId);
  }
  
  res.status(200).json(orders);
}));

// 주문 id로 검색 후 상세 정보 가져옴
orderRouter.get('/orders/:orderId', loginRequired, asyncHandler(async (req, res) => {

  const { orderId } = req.params;

  /// 현재 로그인 된 사람이 admin인지 확인
  const role = req.currentUserRole;
  const currentUserId = req.currentUserId;

  /// admin이 아닐경우, 현재 로그인된 user id와 주문정보의 user id가 다르다면 에러 메세지
  if(role === 'basic-user') {
    const orderUserId = await orderService.getOrderUserId(orderId);
    if (orderUserId !== currentUserId) {
      throw new Error('현재 로그인 된 사용자의 주문 정보가 아닙니다.')
    }
  }

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

  const currentUserId = req.currentUserId;

  const {
    fullNameTo,
    phoneNumberTo,
    addressTo,
    messageTo,
    products
  } = req.body;

  const newOrder = await orderService.addOrder(
    {
      user_id: currentUserId,
      fullNameTo,
      phoneNumberTo,
      addressTo,
      messageTo,
      products
    });
    
  res.status(201).json(newOrder);
}));


// // 로그인 후 주문 정보 수정
orderRouter.patch('/orders/:orderId', loginRequired, asyncHandler(async (req, res) => {

  // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
  if (is.emptyObject(req.body)) {
    throw new Error(
    'headers의 Content-Type을 application/json으로 설정해주세요'
    );
  }

  const { orderId } = req.params;

  /// 현재 로그인 된 사람이 admin인지 확인
  const role = req.currentUserRole;
  const currentUserId = req.currentUserId;

  /// admin이 아닐경우, 현재 로그인된 user id와 주문정보의 user id가 다르다면 에러 메세지
  if(role === 'basic-user') {
    const orderUserId = await orderService.getOrderUserId(orderId);
    if (orderUserId !== currentUserId) {
      throw new Error('현재 로그인 된 사용자의 주문 정보가 아닙니다.')
    }
  }
  
  let {
    fullNameTo,
    phoneNumberTo,
    addressTo,
    messageTo,
    orderStatus,
    csStatus
  } = req.body;

  const currentOrderStatus = await orderService.getCurrentOrderStatus(orderId);
  const currentCsStatus = await orderService.getCurrentCsStatus(orderId);

  ///initialize status
  let toUpdate;

  if (!csStatus && !orderStatus) {

    if (currentOrderStatus.name !== "결제완료") {
      throw new Error('현재 주문 상태에서는 배송 정보를 변경할 수 없습니다.')

    } else {
      /// 업데이트용 객체에 삽입함.
      toUpdate = {
        ...(fullNameTo && { fullNameTo }),
        ...(phoneNumberTo && { phoneNumberTo }),
        ...(addressTo && { addressTo }),
        ...(messageTo && { messageTo }),
      };
    }

  } else {  

    let requestOrderStatusId;
    let requestCsStatusId;
    let adjusted;

    if (orderStatus) {
      requestOrderStatusId = await orderStatusService.getOrderStatusId(orderStatus);
      adjusted = await orderStatusService.adjustStatus(requestOrderStatusId, currentCsStatus.id);
      csStatus = adjusted.csStatus

    } else if (csStatus) {
      requestCsStatusId = await csStatusService.getCsStatusId(csStatus);
      adjusted = await csStatusService.adjustStatus(requestCsStatusId, currentOrderStatus.id);
      orderStatus = adjusted.orderStatus
    }

    /// 업데이트용 객체에 삽입함.
    toUpdate = {
      ...(orderStatus && { orderStatus : adjusted.orderStatus }),
      ...(csStatus && { csStatus : adjusted.csStatus })
    }
  };

  // 상품 정보를 업데이트함.
  const updatedorderInfo = await orderService.setOrder(orderId, toUpdate);
  
  // 업데이트 이후의 데이터를 프론트에 보내 줌
  res.status(200).json(updatedorderInfo);

}));


export { orderRouter };