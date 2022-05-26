import { productModel } from '../db';
import { categoryService } from './category-service';

class ProductService {

  constructor(productModel, categoryService) {
    this.productModel = productModel;
    this.categoryService = categoryService;
  }

  // 전체 상품 갯수 확인
  async countTotalProducts() {
    const total = await this.productModel.countProducts();

    if (total < 1) {
        throw new Error('상품이 없습니다.');
    }
    return total;
  }

  // 페이지 별로 전체 상품 확인 (pagination)
  async getProducts(page, perPage) {
    let products = await this.productModel.findAllbyPage(page, perPage);

    if (products.length < 1) {
        throw new Error('상품이 없습니다.');
    }

    // 카테고리 id를 이름으로 변환
    for(let i = 0; i < products.length; i++) {
      const id = products[i].category;
      const categoryId = await this.categoryService.getCategoryName(id);
      products[i].category = categoryId;
    }

    return products;
  }

  // 선택된 카테고리에 포함된 상품 갯수 확인
  async countCategorizedProduct(category) {
    const total = await this.productModel.countbyCategory(category);

    if (total < 1) {
        throw new Error('상품이 없습니다.');
    }
    return total;
  }

  // 페이지 별로 카테고리에 포함된 상품 확인 (pagination)
  async getProductsByCategory(category, page, perPage) {
    let products = await this.productModel.findByCategory(category, page, perPage);

    if (products.length < 1) {
        throw new Error('상품이 없습니다.');
    }

    // 카테고리 id를 이름으로 변환
    for(let i = 0; i < products.length; i++) {
      const id = products[i].category;
      const categoryId = await this.categoryService.getCategoryName(id);
      products[i].category = categoryId;
    }

    return products;
  }

  // id로 상품 상세정보 확인
  async getProductDetail(productId) {
    const detail = await this.productModel.findById(productId);

    const { 
      name,
      price,
      category,
      briefDesc,
      fullDesc,
      manufacturer,
      stock,
      keyword } = detail;

    // 카테고리 id를 이름으로 변환
    const categoryName = await this.categoryService.getCategoryName(category);

      const newProductInfo = {
        name,
        price,
        category: categoryName,
        briefDesc,
        fullDesc,
        manufacturer,
        stock,
        keyword };
    return newProductInfo;
  }

    // 가격으로 상품 검색
    async getProductsByPrice(from, to) {
      const price = { $gte: from, $lte: to }
      const products = await this.productModel.findByPrice(price);

      for(let i = 0; i < products.length; i++) {
        const id = products[i].category;
        const categoryId = await this.categoryService.getCategoryName(id);
        products[i].category = categoryId;
      }

      return products;
    }

    // 제조사로 상품 검색
    async getProductsByManufacturer(manufacture) {
      const products = await this.productModel.findByManufacturer(manufacture);

      // 카테고리 id를 이름으로 변환
      for(let i = 0; i < products.length; i++) {
        const id = products[i].category;
        const categoryId = await this.categoryService.getCategoryName(id);
        products[i].category = categoryId;
      }
      return products;
    }

    // **** 키워드로 상품 검색 **** 미완성
    async getProductsByKeyword(keyword) {
    const products = await this.productModel.findByKeyword(keyword);
    return products;
    }
  
  // *** 이미지 추가 test  ***
  async addImage(image) {
    const createdNewProduct = await this.productModel.create(image);
    return createdNewProduct;
  }

  // 상품 추가
  async addProduct(productInfo) {
    const { 
      name,
      price,
      category,
      briefDesc,
      fullDesc,
      manufacturer,
      stock,
      keyword } = productInfo;

    const isExist = await this.productModel.findByName(name);
    if (isExist) {
        throw new Error('이 이름으로 생성된 제품이 있습니다. 다른 이름을 지어주세요.');
    }
    const newProductInfo = {
      name,
      price,
      category,
      briefDesc,
      fullDesc,
      manufacturer,
      stock,
      keyword };

    // // db에 저장
    const createdNewProduct = await this.productModel.create(newProductInfo);
    return createdNewProduct;
  }

  // 상품 삭제
  async deleteProduct(productId) {
    let product = await this.productModel.findById(productId);

    if (!product) {
        throw new Error('상품 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    await this.productModel.delete(productId);
    return '삭제가 완료되었습니다';
  }

  // 상품 정보 수정
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


const productService = new ProductService(productModel, categoryService);

export { productService };
