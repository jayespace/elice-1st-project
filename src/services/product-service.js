import { productModel } from '../db';

class ProductService {

  constructor(productModel) {
    this.productModel = productModel;
  }

  async addProduct(productInfo) {
    const { name, price, category, desc } = productInfo;

    const isExist = await this.productModel.findByName(name);
    if (isExist) {
      throw new Error(
      '이 이름으로 생성된 제품이 있습니다. 다른 이름을 지어주세요.'
      );
    }
    const newProductInfo = { name, price, category, desc };
    // db에 저장
    const createdNewProduct = await this.productModel.create(newProductInfo);
    return createdNewProduct;
  }

  async getProducts() {
    const products = await this.productModel.findAll();
    return products;
  }

  async getProductDetail(productId) {
      const detail = await this.productModel.findById(productId);
      return detail;
  }

  async getProductsByCategory(category) {
      const products = await this.productModel.findByCategory(category);
      return products;
  }

  async deleteProduct(productId) {
      await this.productModel.delete(productId);
      return;
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
