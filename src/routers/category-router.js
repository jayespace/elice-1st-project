import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../middlewares';
import { adminRequired } from '../middlewares';
import { asyncHandler } from '../middlewares';
import { categoryService } from '../services';

const categoryRouter = Router();


// 모든 카테고리 정보를 가져옴
categoryRouter.get('/categories', asyncHandler(async (req, res) => {
    const categories = await categoryService.getCategories();
    res.status(200).json(categories);
}));

// 카테고리 id로 검색 후 상세 정보 가져옴
categoryRouter.get('/categories/:categoryId', asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const category = await categoryService.getCategory(categoryId);
    res.status(200).json(category);
}));

// 로그인 후 admin일 경우 카테고리 추가
categoryRouter.post('/categories',
    loginRequired, adminRequired, asyncHandler(async(req,res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { name, desc } = req.body;

    const newCategory = await categoryService.addCategory({
        name,
        desc
    });
    res.status(201).json(newCategory);
}));

// 로그인 후 admin일 경우 카테고리 삭제
categoryRouter.delete('/categories/:categoryId',
    loginRequired, adminRequired, asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const del = await categoryService.deleteCategory(categoryId)
    res.status(200).json(del);

}));

// 로그인 후 admin일 경우 카테고리 정보 수정
categoryRouter.patch('/categories/:categoryId',
    loginRequired, adminRequired, asyncHandler(async (req, res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { categoryId } = req.params;
    const { name, desc } = req.body;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
        ...(name && { name }),
        ...(desc && { desc })
    };
    // 상품 정보를 업데이트함.
    const updatedCategoryInfo = await categoryService.setCategory(categoryId, toUpdate);

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updatedCategoryInfo);

}));

export { categoryRouter };