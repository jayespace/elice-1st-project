import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../middlewares';
import { adminRequired } from '../middlewares';
import { asyncHandler } from '../middlewares';
import { csStatusService } from '../services';

const csStatusRouter = Router();


// 모든 CS Status 정보를 가져옴
csStatusRouter.get('/csStatus', asyncHandler(async (req, res) => {
    const csStatus = await csStatusService.getAllCsStatus();
    res.status(200).json(csStatus);
}));


// CS Status id로 검색 후 상세 정보 가져옴
csStatusRouter.get('/csStatus/:csStatusId', asyncHandler(async (req, res) => {
    const { csStatusId } = req.params;
    const csStatus = await csStatusService.getCsStatus(csStatusId);
    res.status(200).json(csStatus);
}));

// 로그인 후 admin일 경우 CS Status 추가
csStatusRouter.post('/csStatus', loginRequired, adminRequired,
    asyncHandler(async(req,res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { name } = req.body;

    const newCsStatus = await csStatusService.addCsStatus({ name });
    res.status(201).json(newCsStatus);
}));

// 로그인 후 admin일 경우 CS Status 삭제
csStatusRouter.delete('/csStatus/:csStatusId', loginRequired, adminRequired,
     asyncHandler(async (req, res) => {
    const { csStatusId } = req.params;

    const del = await csStatusService.deleteCsStatus(csStatusId)
    res.status(200).json(del);

}));

// 로그인 후 admin일 경우 CS Status 정보 수정
csStatusRouter.patch('/csStatus/:csStatusId', loginRequired, adminRequired,
    asyncHandler(async (req, res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { csStatusId } = req.params;
    const { name } = req.body;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
        ...(name && { name })
    };
    // 상품 정보를 업데이트함.
    const updatedCsStatus = await csStatusService.setCsStatus(csStatusId, toUpdate);

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updatedCsStatus);
}));

export { csStatusRouter };