import { productModel } from '../db';
import { categoryService } from './category-service';

class ProductService {

  constructor(productModel, categoryService) {
    this.productModel = productModel;
    this.categoryService = categoryService;
  }

  ///// 전체 상품 갯수 확인
  async countTotalProducts() {
    const total = await this.productModel.countProducts();

    if (total < 1) {
        throw new Error('상품이 없습니다.');
    }
    return total;
  }


  ///// 페이지 별로 전체 상품 확인 (pagination)
  async getProducts(page, perPage) {
    let products = await this.productModel.findAllbyPage(page, perPage);

    if (products.length < 1) {
        throw new Error('상품이 없습니다.');
    }

    const productList = [];
    for(let i = 0; i < products.length; i++) {

      const product = products[i];

      const { 
        name,
        price,
        category,
        briefDesc,
        fullDesc,
        manufacturer,
        stock,
        keyword,
        image
        } = product;

      const product_category_id = product.category.valueOf();
      const categoryName = await this.categoryService.getCategoryName(product_category_id);

      let modified = { 
        name,
        price,
        category: categoryName,
        briefDesc,
        fullDesc,
        manufacturer,
        stock,
        keyword,
        image };

        productList.push(modified)
    }

    return productList;
  }


  ///// 선택된 카테고리에 포함된 상품 갯수 확인
  async countProductsByCategory(field) {
    const total = await this.productModel.countbyCategory(field);

    if (total < 1) {
        throw new Error('상품이 없습니다.');
    }
    return total;
  }

  // **** 페이지 별로 카테고리에 포함된 상품 확인 (pagination) ****
  async getProductsByCateogory(category, page, perPage) {

    let products = await this.productModel.findByCategory(category, page, perPage);

    if (products.length < 1) {
        throw new Error('상품이 없습니다.');
    }

    const productList = [];
    for(let i = 0; i < products.length; i++) {

      const product = products[i];

      const { 
        name,
        price,
        category,
        briefDesc,
        fullDesc,
        manufacturer,
        stock,
        keyword,
        image
        } = product;

      const product_category_id = product.category.valueOf();
      const categoryName = await this.categoryService.getCategoryName(product_category_id);

      let modified = { 
        name,
        price,
        category: categoryName,
        briefDesc,
        fullDesc,
        manufacturer,
        stock,
        keyword,
        image };

        productList.push(modified)
    }

    return productList;
  }


  //// id로 상품 상세정보 확인
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
      keyword,
      image } = detail;

      const product_category_id = detail.category.valueOf();
      const categoryName = await this.categoryService.getCategoryName(product_category_id);

      const newProductInfo = {
        name,
        price,
        category: categoryName,
        briefDesc,
        fullDesc,
        manufacturer,
        stock,
        keyword,
        image };

    return newProductInfo;
  }

  /////// 가격으로 상품 검색
  async getProductsByPrice(from, to) {
    const price = { $gte: from, $lte: to }
    const products = await this.productModel.findByPrice(price);



    return products;
  }

  ////// 제조사로 상품 검색
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

  ////// **** 키워드로 상품 검색 **** 미완성 ********
  async getProductsByKeyword(keyword) {
    const products = await this.productModel.findByKeyword(keyword);
    return products;
  }


  //// 상품 추가
  async addProduct(productInfo) {
    const { 
      name,
      price,
      category,
      briefDesc,
      fullDesc,
      manufacturer,
      stock,
      keyword,
      image
      } = productInfo;
    
    const isExist = await this.productModel.findByName(name);
    if (isExist) {
        throw new Error('이 이름으로 생성된 제품이 있습니다. 다른 이름을 지어주세요.');
    }

    // 카테고리 이름으로 id 찾기
    const categoryId = await this.categoryService.getCategoryId(category);

    const newProductInfo = {
      name,
      price,
      category: categoryId,
      briefDesc,
      fullDesc,
      manufacturer,
      stock,
      keyword,
      image };

    // db에 저장
    const createdNewProduct = await this.productModel.create(newProductInfo);
    return createdNewProduct;
  }


  //// 상품 삭제
  async deleteProduct(productId) {
    let product = await this.productModel.findById(productId);

    if (!product) {
        throw new Error('상품 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    await this.productModel.delete(productId);
    return '삭제가 완료되었습니다';
  }


  //// 상품 정보 수정
  async setProduct(productId, toUpdate) {
    let product = await this.productModel.findById(productId);

    if (!product) {
        throw new Error('상품 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    
    // 변경할 카테고리가 있을 경우 카테고리 이름으로 objectId 검색하여 db 카테고리 필드에 id 저장
    if (toUpdate.category) {

      let categoryName = toUpdate.category;

      const categoryId = await this.categoryService.getCategoryId(categoryName);
      const product_category_id = categoryId.valueOf();

      toUpdate.category = product_category_id;
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
