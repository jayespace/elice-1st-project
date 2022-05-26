import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../middlewares';
import { adminRequired } from '../middlewares';
import { asyncHandler } from '../middlewares';
import { productService } from '../services';
import { categoryService } from '../services';
import { upload } from '../utils';

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

// 상품 가격으로 검색 후 정보 가져옴
productRouter.get('/products/price', asyncHandler(async (req, res) => {
    
    // 검색을 원하는 최소가격, 최대가격 query로 받기
    const { from, to } = req.query;
    
    const products = await productService.getProductsByPrice(from, to);
    res.status(200).json(products);
}));

// 상품 제조사로 검색 후 정보 가져옴
productRouter.get('/products/manufacturer/:manufacturer', asyncHandler(async (req, res) => {
    const { manufacturer } = req.params;
    const products = await productService.getProductsByManufacturer(manufacturer);
    res.status(200).json(products);
}));

// 키워드로 검색 후 정보 가져옴
productRouter.get('/products/keyword/:keyword', asyncHandler(async (req, res) => {
    const { keyword } = req.params;
    const products = await productService.getProductsByKeyword(keyword);
    res.status(200).json(products);
}));

// 상품 id로 검색 후 상세 정보 가져옴
productRouter.get('/products/:productId', asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const product = await productService.getProductDetail(productId);
    res.status(200).json(product);
}));

// ****** 이미지저장 테스트 **********
productRouter.post('/image', upload.single('image'), asyncHandler(async(req,res) => {
    // const image = req.file.location;
    res.send(req.file.location)
}))

// 로그인 후 admin일 경우 상품 추가
productRouter.post('/products',
  loginRequired, adminRequired, asyncHandler(async(req,res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }
        
    const {
        name,
        price,
        category,
        briefDesc,
        fullDesc,
        manufacturer,
        stock,
        keyword
    } = req.body;

    // 카테고리 이름으로 id 찾기
    const categoryId = await categoryService.getCategoryId(category)

    const newProduct = await productService.addProduct({
        name,
        price,
        category: categoryId,
        briefDesc,
        fullDesc,
        manufacturer,
        stock,
        keyword
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
    const { name,
            price,
            category,
            briefDesc,
            fullDesc,
            manufacturer,
            stock,
            keyword } = req.body;

    const categoryId = await categoryService.getCategoryId(category)

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
        ...(name && { name }),
        ...(price && { price }),
        ...(category && { category: categoryId }),
        ...(briefDesc && { briefDesc }),
        ...(fullDesc && { fullDesc }),
        ...(manufacturer && { manufacturer }),
        ...(stock && { stock }),
        ...(keyword && { keyword }),
    };
    // 상품 정보를 업데이트함.
    const updatedProductInfo = await productService.setProduct(productId, toUpdate);

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updatedProductInfo);

}));

export { productRouter };