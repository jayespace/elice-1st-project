import { Router } from 'express';
import is from '@sindresorhus/is';
import { productService } from '../services';
import asyncHandler from '../middlewares/async-handler';

const productRouter = Router();

productRouter.get('/products', asyncHandler(async (req, res) => {
    const totalProducts = await productService.countTotalProducts();

    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    const products = await productService.getProductByPages(page, perPage);

    const totalPage = Math.ceil(totalProducts / perPage);

    res.status(200).json({
        products,
        page,
        perPage,
        totalPage,
        totalProducts
        }
    );
}));

productRouter.get('/products/category/:category', asyncHandler(async (req, res) => {
    const { category } = req.params;
    const totalProducts = await productService.countCategorized(category);

    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    const products = await productService.getProdByCatByPages(category, page, perPage);

    const totalPage = Math.ceil(totalProducts / perPage);

    res.status(200).json({
        products,
        page,
        perPage,
        totalPage,
        totalProducts
        }
    );
}));

productRouter.get('/products/:productId', asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const product = await productService.getProductDetail(productId);
    res.status(200).json(product);
}));

productRouter.get('/categories', asyncHandler(async (req, res) => {
    const categories = await productService.getCategories();
    res.status(200).json(categories);
}));

productRouter.post('/products', asyncHandler(async(req,res) => {
    
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { name, price, category, desc } = req.body;

    const newProduct = await productService.addProduct({
        name,
        price,
        category,
        desc
    });
    res.status(200).json(newProduct);
}));

productRouter.delete('/products/:productId', asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const del = await productService.deleteProduct(productId)
    res.status(200).json(del);

}));


productRouter.patch('/products/:productId', asyncHandler(async (req, res) => {

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
    // 정보를 업데이트함.
    const updatedProductInfo = await productService.setProduct(productId, toUpdate);

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updatedProductInfo);

}));

export { productRouter };