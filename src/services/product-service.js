import { productModel } from '../db';

class ProductService {

  constructor(productModel) {
    this.productModel = productModel;
  }

  async countTotalProducts() {
    const total = await this.productModel.countProducts();

    if (total < 1) {
        throw new Error('상품이 없습니다.');
    }
    return total;
  }

  async getProducts(page, perPage) {
    let products = await this.productModel.findAllbyPage(page, perPage);

    if (products.length < 1) {
        throw new Error('상품이 없습니다.');
    }
    return products;
  }

  async countCategorizedProduct(category) {
    const total = await this.productModel.countbyCategory(category);

    if (total < 1) {
        throw new Error('상품이 없습니다.');
    }
    return total;
  }

  async getProductsByCategory(category, page, perPage) {
    let products = await this.productModel.findByCategory(category, page, perPage);

    if (products.length < 1) {
        throw new Error('상품이 없습니다.');
    }
    return products;
  }

  async getProductDetail(productId) {
    const detail = await this.productModel.findById(productId);
    return detail;
  }

  async getCategories() {
    const products = await this.productModel.findAll();
    const categories = products.map(product => product.category);
    return [...new Set(categories)];
  }

  async addProduct(productInfo) {
    const { name, price, category, desc } = productInfo;

    const isExist = await this.productModel.findByName(name);
    if (isExist) {
        throw new Error('이 이름으로 생성된 제품이 있습니다. 다른 이름을 지어주세요.');
    }
    const newProductInfo = { name, price, category, desc };
    // db에 저장
    const createdNewProduct = await this.productModel.create(newProductInfo);
    return createdNewProduct;
  }

  async deleteProduct(productId) {
    let product = await this.productModel.findById(productId);

    if (!product) {
        throw new Error('상품 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    await this.productModel.delete(productId);
    return '삭제가 완료되었습니다';
  }

  async setProduct(productId, toUpdate) {
    let product = await this.productModel.findById(productId);

    if (!product) {
        throw new Error('상품 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    
    product = await this.productModel.update({
        productId,
        update: toUpdate,
    });

    return product;
  }
};


const productService = new ProductService(productModel);

export { productService };
