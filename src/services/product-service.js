import { productModel, categoryModel } from '../db';

class ProductService {

  constructor(productModel, categoryModel) {
    this.productModel = productModel;
    this.categoryModel = categoryModel;
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
        _id,
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
      const categoryInfo = await this.categoryModel.findById(product_category_id);

      if (!categoryInfo) {
        throw new Error('해당 카테고리 내역이 없습니다. 다시 한 번 확인해 주세요.');
      }
      const categoryName = categoryInfo.name;

      let modified = { 
        _id,
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
  async countByField(field, value) {

    let total = 0;

    if (field == 'category') {
      /// 이름으로 id 찾기
      const categoryInfo = await this.categoryModel.findByName(value);

      if (!categoryInfo) {
        throw new Error('해당 카테고리 내역이 없습니다. 다시 한 번 확인해 주세요.');
      }
      const categoryId = categoryInfo._id;
      total = await this.productModel.countbyCategory(categoryId);

    } else if (field == 'manufacturer') {
      total = await this.productModel.countbyManufacturer(value);

    } else if (field == 'minPrice') {
      const priceRange = { $gte: value }
      total = await this.productModel.countbyPrice(priceRange);
    
    } else if (field == 'maxPrice') {
      const priceRange = { $lte: value }
      total = await this.productModel.countbyPrice(priceRange);

    } else if (field == 'keyword') {
      total = await this.productModel.countbyKeyword(value);
    }

    if (total < 1) {
        throw new Error('상품이 없습니다.');
    }
    return total;
  }

  //// **** 페이지 별로 특정 필드에 포함된 상품 확인 (pagination) ****
  async getProductsByField(field, value, page, perPage) {

    let products;

    if (field == 'category') {
      /// 이름으로 id 찾기
      const categoryInfo = await this.categoryModel.findByName(value);

      if (!categoryInfo) {
        throw new Error('해당 카테고리 내역이 없습니다. 다시 한 번 확인해 주세요.');
      }
      const categoryId = categoryInfo._id;

      products = await this.productModel.findByCategory(categoryId, page, perPage);

    } else if (field == 'manufacturer') {
      products = await this.productModel.findByManufacturer(value, page, perPage);

    } else if (field == 'minPrice') {
      const priceRange = { $gte: value }
      products = await this.productModel.findByPrice(priceRange, page, perPage);

    } else if (field == 'maxPrice') {
      const priceRange = { $lte: value }
      products = await this.productModel.findByPrice(priceRange, page, perPage);

    } else if (field == 'keyword') {
      products = await this.productModel.findByKeyword(value, page, perPage);
    }

    if (products.length < 1) {
        throw new Error('상품이 없습니다.');
    }

    const productList = [];
    for(let i = 0; i < products.length; i++) {

      const product = products[i];

      const {
        _id,
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

      /// 카테고리 id로 이름 찾기
      const product_category_id = product.category.valueOf();
      const categoryInfo = await this.categoryModel.findById(product_category_id);

      if (!categoryInfo) {
        throw new Error('해당 카테고리 내역이 없습니다. 다시 한 번 확인해 주세요.');
      }
      const categoryName = categoryInfo.name;

      // 카테고리 이름으로 반영된 정보 담기
      let modified = { 
        _id,
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
      _id,
      name,
      price,
      category,
      briefDesc,
      fullDesc,
      manufacturer,
      stock,
      keyword,
      image
    } = detail;

    /// 카테고리 id로 이름찾기
    const product_category_id = detail.category.valueOf();
    const categoryInfo = await this.categoryModel.findById(product_category_id);

    if (!categoryInfo) {
      throw new Error('해당 카테고리 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    const categoryName = categoryInfo.name;

    // 카테고리 이름으로 반영된 정보 담기
    const newProductInfo = {
      _id,
      name,
      price,
      category: categoryName,
      briefDesc,
      fullDesc,
      manufacturer,
      stock,
      keyword,
      image
    };

    return newProductInfo;
  }
  

  /// 제품 이름으로 정보 찾기
  async getProductByName(name) {
    const product = await this.productModel.findByName(name);
    return product;
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
    const categoryInfo = await this.categoryModel.findByName(category);

    if (!categoryInfo) {
      throw new Error('해당 카테고리 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    const categoryId = categoryInfo._id;

    // 카테고리 이름으로 반영된 정보 담기
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

    // db에 저장 후 반환
    const createdNewProduct = await this.productModel.create(newProductInfo);
    return createdNewProduct;
  }


  //// 상품 삭제
  async deleteProduct(productId) {
    let product = await this.productModel.findById(productId);

    if (!product) {
        throw new Error('상품 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    
    const deletedProduct = await this.productModel.delete(productId);
    return deletedProduct;
  }

  //// 상품 정보 수정 ***************
  async setProduct(productId, toUpdate) {

    let product = await this.productModel.findById(productId);

    if (!product) {
        throw new Error('상품 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    
    // 변경할 카테고리가 있을 경우 카테고리 이름으로 objectId 검색하여 db 카테고리 필드에 id 저장
    if (toUpdate.category) {

      const categoryName = toUpdate.category;
      const categoryInfo = await this.categoryModel.findByName(categoryName);

      if (!categoryInfo) {
        throw new Error('해당 카테고리 내역이 없습니다. 다시 한 번 확인해 주세요.');
      }

      const categoryId = categoryInfo._id;
      const product_category_id = categoryId.valueOf();

      toUpdate.category = product_category_id;
    }

    product = await this.productModel.update({
        productId,
        update: toUpdate,
    });
    
    return product;
  };


  /// 카테고리 id로 정보 조회
  async isExist(categoryId) {

    const products = await this.productModel.findByCategoryId(categoryId);
    return products;
  }

  /// 제품 id로 정보 조회
  async getDetail(productId) {

    const product = await this.productModel.findById(productId);
    return product;
  }

  /// 주문 들어올 경우 재고 수정
  // async modifyStock(productId, orderedQty) {
  //   let product = await this.productModel.findById(productId);
  //   const { stock } = product;
  //   const qty = orderedQty
  //   const toUpdate = {
  //     stock: stock-qty
  //   }
    
  //   product = await this.productModel.update({
  //     productId,
  //     update: toUpdate,
  //   });

  //   return product.stock;
  // }

};


const productService = new ProductService(productModel, categoryModel);

export { productService };
