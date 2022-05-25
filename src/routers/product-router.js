import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../middlewares';
import { adminRequired } from '../middlewares';
import { asyncHandler } from '../middlewares';
import { productService } from '../services';
import { upload } from '../utils'; // 사진 업로드 모듈

const productRouter = Router();

// 전체 상품 검색 (page 별로 확인)
productRouter.get('/products', asyncHandler(async (req, res) => {
    const totalProducts = await productService.countTotalProducts();

    // 페이지 번호와 페이지에 표시할 상품 갯수 설정
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    const products = await productService.getProducts(page, perPage);

    const totalPage = Math.ceil(totalProducts / perPage);

    // 페이지에 표시할 제품 상세 목록, 페이지 번호, 한 페이지에 표시할 수량, 총 페이지 수, 전체 제품 수량 반환
    res.status(200).json({
        products,
        page,
        perPage,
        totalPage,
        totalProducts
        }
    );
}));

// 특정 카테고리에 속해 있는 상품 정보 가져옴 (page 형태로 확인)
productRouter.get('/products/category/:category', asyncHandler(async (req, res) => {
    const { category } = req.params;
    const totalProducts = await productService.countCategorizedProduct(category);

    // 페이지 번호와 페이지에 표시할 상품 갯수 설정
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    const products = await productService.getProductsByCategory(category, page, perPage);

    const totalPage = Math.ceil(totalProducts / perPage);

    // 페이지에 표시할 제품 상세 목록, 페이지 번호, 한 페이지에 표시할 수량, 총 페이지 수, 전체 제품 수량 반환
    res.status(200).json({
        products,
        page,
        perPage,
        totalPage,
        totalProducts
        }
    );
}));

// 상품 id로 검색 후 상세 정보 가져옴
productRouter.get('/products/:productId', asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const product = await productService.getProductDetail(productId);
    res.status(200).json(product);
}));

// 카테고리 정보를 가져옴
productRouter.get('/categories', asyncHandler(async (req, res) => {
    const categories = await productService.getCategories();
    res.status(200).json(categories);
}));

// 로그인 후 admin일 경우 상품 추가
productRouter.post('/products', loginRequired, adminRequired, asyncHandler(async(req,res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    // AWS s3로 이미지 업로드
    upload.single('product_image');
        
    const { name, price, category, desc } = req.body;
    const image = req.file.location;

    const newProduct = await productService.addProduct({
        name,
        price,
        category,
        image,
        desc
    });
    res.status(200).json(newProduct);
}));

// 로그인 후 admin일 경우 상품 삭제
productRouter.delete('/products/:productId', loginRequired, adminRequired, asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const del = await productService.deleteProduct(productId)
    res.status(200).json(del);

}));

// 로그인 후 admin일 경우 상품 정보 수정
productRouter.patch('/products/:productId', loginRequired, adminRequired, asyncHandler(async (req, res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { productId } = req.params;
    const { name, price, category, desc } = req.body;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
        ...(name && { name }),
        ...(price && { price }),
        ...(category && { category }),
        ...(desc && { desc }),
    };
    // 상품 정보를 업데이트함.
    const updatedProductInfo = await productService.setProduct(productId, toUpdate);

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updatedProductInfo);

}));

export { productRouter };