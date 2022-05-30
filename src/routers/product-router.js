import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../middlewares';
import { adminRequired } from '../middlewares';
import { asyncHandler } from '../middlewares';
import { productService } from '../services';
import { upload } from '../utils';

const productRouter = Router();


///// 상품 id로 검색 후 상세 정보 가져옴
productRouter.get('/products/:productId', asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const product = await productService.getProductDetail(productId);
    res.status(200).json(product);
}));


//// 전체 상품 또는 특정 필드의 정보 가져옴 (page 형태로 확인) 
productRouter.get('/products', asyncHandler(async (req, res) => {

    // 페이지 번호와 페이지에 표시할 상품 갯수 설정
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    /// query가 어떤건지 확인
    const queries = Object.keys(req.query)
    const field = queries.find(e => e == 'category' || e == 'manufacturer' || e == 'price' || e == 'keyword')

    //initialize keywords
    let totalProducts;
    let products;
    let value;

    if (!field) {
        totalProducts = await productService.countTotalProducts();
        products = await productService.getProducts(page, perPage);

    } else {
        if (field == 'category') {
            value = req.query.category;
        } else if (field == 'manufacturer') {
            value = req.query.manufacturer;
        } else if (field == 'price') {
            value = req.query.price;
        } else if (field == 'keyword') {
            value = req.query.keyword;
        }
        totalProducts = await productService.countByField(field,value);
        products = await productService.getProductsByField(field, value, page, perPage);
    }
    

//     const totalPage = Math.ceil(totalProducts / perPage);

//     // 페이지에 표시할 제품 상세 목록, 페이지 번호, 한 페이지에 표시할 수량, 총 페이지 수, 전체 제품 수량 반환
//     res.status(200).json({
//         products,
//         page,
//         perPage,
//         totalPage,
//         totalProducts
//         }
//     );
// }));


// 로그인 후 admin일 경우 상품 추가
productRouter.post('/products', loginRequired, adminRequired,
 upload.single('image'), asyncHandler(async(req,res) => {

    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    /// 이미지 url 주소
    const image = req.file.location;

    const {
        name,
        price,
        category,
        briefDesc,
        fullDesc,
        manufacturer,
        stock,
        keyword } = req.body;

    const newProduct = await productService.addProduct({
        name,
        price,
        category,
        briefDesc,
        fullDesc,
        manufacturer,
        stock,
        keyword,
        image
    });
    res.status(201).json(newProduct);
}));


// 로그인 후 admin일 경우 상품 정보 수정
productRouter.patch('/products/:productId', loginRequired, adminRequired,
     upload.single('image'), asyncHandler(async (req, res) => {

    const { productId } = req.params;

    // 만약 이미지가 있다면 url 받아오고 이미지가 없을 시 body가 비어있는지 확인
    let newImage = "none";
    if (req.file) {
        newImage = req.file.location;
    } else {
        if (is.emptyObject(req.body)) {
            throw new Error(
            'headers의 Content-Type을 application/json으로 설정해주세요'
            );
        }
    }

    const { name,
            price,
            category,
            briefDesc,
            fullDesc,
            manufacturer,
            stock,
            keyword } = req.body;

    let { image } = req.body;

    if (newImage !== "none") {
        image = newImage
    }

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
        ...(name && { name }),
        ...(price && { price }),
        ...(category && { category }),
        ...(briefDesc && { briefDesc }),
        ...(fullDesc && { fullDesc }),
        ...(manufacturer && { manufacturer }),
        ...(stock && { stock }),
        ...(keyword && { keyword }),
        ...(image && { image }),
    };
    // 상품 정보를 업데이트함.
    const updatedProductInfo = await productService.setProduct(productId, toUpdate);

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updatedProductInfo);

}));

// 로그인 후 admin일 경우 상품 삭제
productRouter.delete('/products/:productId', loginRequired, adminRequired,
     asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const del = await productService.deleteProduct(productId)
    res.status(200).json(del);
}));

export { productRouter };