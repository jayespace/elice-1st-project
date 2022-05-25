import { productModel } from '../db';

class ProductService {

  constructor(productModel) {
    this.productModel = productModel;
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
    return products;
  }

  // id로 상품 상세정보 확인
  async getProductDetail(productId) {
    const detail = await this.productModel.findById(productId);
    return detail;
  }

  // 카테고리 확인
  async getCategories() {
    const products = await this.productModel.findAll();
    const categories = products.map(product => product.category);
    return [...new Set(categories)];
  }

    // 가격으로 상품 검색
    async getProductsByPrice(price) {
      const products = await this.productModel.findByPrice(price);
      return products;
    }

    // 제조사로 상품 검색
    async getProductsByManufacturer(manufacture) {
      const products = await this.productModel.findByManufacturer(manufacture);
      return products;
    }

    // 제조사로 상품 검색
    async getProductsByKeyword(keyword) {
    const products = await this.productModel.findByKeyword(keyword);
    return products;
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
    // db에 저장
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

  // const updateInfo = (async (fields) => {
  //   const { userId, requestedFields, profile_picture } = fields
  //   console.log(profile_picture)
    
  //   return prisma.users.update({
  //       where: {
  //           id: Number(userId),
  //       },
  //       data: {
  //           phone_number : requestedFields.phone_number,
  //           profile_picture
  //       }
  //       })
  //   })
};


const productService = new ProductService(productModel);

export { productService };
