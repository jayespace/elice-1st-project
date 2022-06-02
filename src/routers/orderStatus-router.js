import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../middlewares';
import { adminRequired } from '../middlewares';
import { asyncHandler } from '../middlewares';
import { orderStatusService } from '../services';

const orderStatusRouter = Router();


// 모든 order Status 정보를 가져옴
orderStatusRouter.get('/orderStatus', asyncHandler(async (req, res) => {
    const orderStatus = await orderStatusService.getAllOrderStatus();
    res.status(200).json(orderStatus);
}));


// order Status id로 검색 후 상세 정보 가져옴
orderStatusRouter.get('/orderStatus/:orderStatusId', asyncHandler(async (req, res) => {
    const { orderStatusId } = req.params;
    const orderStatus = await orderStatusService.getOrderStatus(orderStatusId);
    res.status(200).json(orderStatus);
}));

// 로그인 후 admin일 경우 order Status 추가
orderStatusRouter.post('/orderStatus', loginRequired, adminRequired,
    asyncHandler(async(req,res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { name } = req.body;
    console.log(name);
    const newOrderStatus = await orderStatusService.addOrderStatus({ name });
    res.status(201).json(newOrderStatus);
}));

// 로그인 후 admin일 경우 order Status 삭제
orderStatusRouter.delete('/orderStatus/:orderStatusId', loginRequired, adminRequired,
     asyncHandler(async (req, res) => {
    const { orderStatusId } = req.params;

    const del = await orderStatusService.deleteOrderStatus(orderStatusId)
    res.status(200).json(del);

}));

// 로그인 후 admin일 경우 order Status 정보 수정
orderStatusRouter.patch('/orderStatus/:orderStatusId', loginRequired, adminRequired,
    asyncHandler(async (req, res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { orderStatusId } = req.params;
    const { name } = req.body;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
        ...(name && { name })
    };
    // 상품 정보를 업데이트함.
    const updatedOrderStatus = await orderStatusService.setOrderStatus(orderStatusId, toUpdate);

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updatedOrderStatus);

}));

export { orderStatusRouter };