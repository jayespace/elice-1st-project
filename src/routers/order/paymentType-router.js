import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../../middlewares';
import { adminRequired } from '../../middlewares';
import { asyncHandler } from '../../middlewares';
import { paymentTypeService } from '../../services';

const paymentTypeRouter = Router();


// 모든 payment Type 정보를 가져옴
paymentTypeRouter.get('/paymentType', asyncHandler(async (req, res) => {
    const paymentType = await paymentTypeService.getAllPaymentType();
    res.status(200).json(paymentType);
}));


// payment Type id로 검색 후 상세 정보 가져옴
paymentTypeRouter.get('/paymentType/:paymentTypeId', asyncHandler(async (req, res) => {
    const { paymentTypeId } = req.params;
    const paymentType = await paymentTypeService.getPaymentType(paymentTypeId);
    res.status(200).json(paymentType);
}));

// 로그인 후 admin일 경우 payment Type 추가
paymentTypeRouter.post('/paymentType', loginRequired, adminRequired,
    asyncHandler(async(req,res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { name } = req.body;

    const newPaymentType = await paymentTypeService.addPaymentType({ name });
    res.status(201).json(newPaymentType);
}));

// 로그인 후 admin일 경우 payment Type 삭제
paymentTypeRouter.delete('/paymentType/:paymentTypeId', loginRequired, adminRequired,
     asyncHandler(async (req, res) => {
    const { paymentTypeId } = req.params;

    const del = await paymentTypeService.deletePaymentType(paymentTypeId)
    res.status(200).json(del);

}));

// 로그인 후 admin일 경우 payment Type 정보 수정
paymentTypeRouter.patch('/paymentType/:paymentTypeId', loginRequired, adminRequired,
    asyncHandler(async (req, res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { paymentTypeId } = req.params;
    const { name } = req.body;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
        ...(name && { name })
    };
    // 상품 정보를 업데이트함.
    const updatedPaymentType = await paymentTypeService.setPaymentType(paymentTypeId, toUpdate);

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updatedPaymentType);

}));

export { paymentTypeRouter };