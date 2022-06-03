import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../middlewares';
import { adminRequired } from '../middlewares';
import { asyncHandler } from '../middlewares';
import { systemCodeService } from '../services';

const systemCodeRouter = Router();


// 모든 시스템코드 정보를 가져옴
systemCodeRouter.get('/admin/systemCodes',loginRequired,adminRequired,asyncHandler(async (req, res) => {
    const systemCodes = await systemCodeService.getSystemCodes();
    res.status(200).json(systemCodes);
}));

// 시스템코드_id로 검색 후 상세 정보 가져옴
systemCodeRouter.get('/admin/systemCodes/:systemCodeId',loginRequired,adminRequired,asyncHandler(async (req, res) => {
    const { systemCodeId } = req.params;
    const systemCode = await systemCodeService.getSystemCode(systemCodeId);
    res.status(200).json(systemCode);
}));

// 로그인 후 admin일 경우 카테고리 추가
systemCodeRouter.post('/admin/systemCode',
    loginRequired, adminRequired, asyncHandler(async(req,res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { name, desc } = req.body;

    const newSystemCode = await systemCodeService.addSystemCode({
        name,
        desc
    });
    res.status(201).json(newSystemCode);
}));

// 로그인 후 admin일 경우 카테고리 삭제
systemCodeRouter.delete('/admin/systemCodes/:systemCodeId', loginRequired, adminRequired, asyncHandler(async (req, res) => {
    const { systemCodeId } = req.params;

    const deleteSystemCode = await systemCodeService.deleteSystemCode(systemCodeId)
    res.status(200).json(deleteSystemCode);

}));

// 로그인 후 admin일 경우 카테고리 정보 수정
systemCodeRouter.patch('/admin/systemCodes/:systemCodeId', loginRequired, adminRequired, asyncHandler(async (req, res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { systemCodeId } = req.params;
    const { name, desc } = req.body;
    
    const isExist = await systemCodeService.getSystemCodeByName(name);
    if (isExist) {
        throw new Error('이 이름으로 생성된 시스템코드가 있습니다. 다른 이름을 지어주세요.');
    }
    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
        ...(name && { name }),
        ...(desc && { desc })
    };
    // 상품 정보를 업데이트함.
    const updatedSystemCodeId = await systemCodeService.setSystemCode(systemCodeId, toUpdate);

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updatedSystemCodeId);

}));

export { systemCodeRouter };