import { categoryModel } from '../db';

class CategoryService {

  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }
  // 전체 카테고리 갯수 확인
  async countTotalCategories() {
    const total = await this.categoryModel.countCategories();

    if (total < 1) {
        throw new Error('카테고리가 없습니다.');
    }
    return total;
  }

  // 전체 카테고리 목록 확인
  async getCategories() {
    const categories = await this.categoryModel.findAll();

    if (categories.length < 1) {
      throw new Error('카테고리가 없습니다.');
    }
    return categories;
  }

  // 카테고리 상세정보 확인
  async getCategory(categoryId) {
    const category = await this.categoryModel.findById(categoryId);

    if (!category) {
      throw new Error('카테고리가 없습니다.');
    }

    return category;
  }

  // 카테고리 이름으로 id 찾기
  async getCategoryId(name) {
    const category = await this.categoryModel.findByName(name);
    const categoryId = category._id;
    return categoryId;
  }

    // 카테고리 id로 이름 찾기
  async getCategoryName(categoryId) {
    const category = await this.categoryModel.findById(categoryId);
    const categoryName = category.name;
    return categoryName;
  }


  // 상품 추가
  async addCategory(categoryInfo) {
    const { name, desc } = categoryInfo;

    const isExist = await this.categoryModel.findByName(name);
    if (isExist) {
        throw new Error('이 이름으로 생성된 카테고리가 있습니다. 다른 이름을 지어주세요.');
    }
    const newCategoryInfo = { name, desc };
    // db에 저장
    const createdNewCategory = await this.categoryModel.create(newCategoryInfo);
    return createdNewCategory;
  }

  // 상품 정보 수정
  async setCategory(categoryId, toUpdate) {
    let category = await this.categoryModel.findById(categoryId);

    if (!category) {
        throw new Error('해당 카테고리 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    
    category = await this.categoryModel.update({
        categoryId,
        update: toUpdate,
    });

    return category;
  }

// 상품 삭제
  async deleteCategory(categoryId) {
    let category = await this.categoryModel.findById(categoryId);

    if (!category) {
        throw new Error('해당 카테고리 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    await this.categoryModel.delete(categoryId);
    return '삭제가 완료되었습니다';
  }

};


const categoryService = new CategoryService(categoryModel);

export { categoryService };
