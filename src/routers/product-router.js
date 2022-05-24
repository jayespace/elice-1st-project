import { Router } from 'express';
// import is from '@sindresorhus/is';
import { productService } from '../services';

const productRouter = Router();

productRouter.get('/products', async (req, res) => {
    const products = await productService.getProducts();

    if (products.length < 1) {
        res.json('no products');
        return;
    }
    res.status(200).json(products);
})

productRouter.get('/products/:category', async (req, res) => {
    const { category } = req.params;
    const filtered = await productService.getProductsByCategory(category);
    res.status(200).json(filtered);
})

productRouter.get('/products/:_id', async (req, res) => {
    const { _id } = req.params;
    const product = await productService.getProductDetail(_id);
    res.status(200).json(product);
})

productRouter.post('/products', async(req,res) => {
    const { name, price, category, desc } = req.body;
    const { admin } = req.query;

    if(admin !== 'true') {
        console.log('admin만 생성 가능합니다.');
        res.redirect('/');
        return;
    }

    const newProduct = await productService.addProduct({
        name,
        price,
        category,
        desc
    });
    res.status(200).json(newProduct);
})

productRouter.delete('/products/:_id', async (req, res) => {
    const { _id } = req.params;
    const { admin } = req.query;

    if(admin !== 'true') {
        console.log('admin만 삭제 가능합니다.');
        res.redirect('/');
        return;
    }

    await productService.deleteProduct(_id)
    .then(result => {
        return res.status(200).json('삭제가 완료되었습니다.');
    }).catch(err => {
        console.log(err);
    });


productRouter.patch('/products/:_id', async function (req, res, next) {
    try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
        throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
        );
    }

    const { _id } = req.params;
    const { name, price, category, desc } = req.body;

    const { admin } = req.query;

    if (admin !== 'true') {
        throw new Error('admin만 삭제 가능합니다.');
    }
    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
        ...(name && { name }),
        ...(price && { price }),
        ...(category && { category }),
        ...(desc && { desc }),
    };
    // 사용자 정보를 업데이트함.
    const updatedProductInfo = await productService.setProduct(_id, toUpdate);

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedProductInfo);
    } catch (error) {
    next(error);
    }
});

});

export { productRouter };