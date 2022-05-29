import { model } from 'mongoose';
import { ProductOptionSchema } from '../schemas/prductOption-schema';

const ProductOption = model('productOption', ProductOptionSchema);

export class ProductOptionModel {

  async findAll() {
    const productOptions = await ProductOption.find({});
    return productOptions;
  }

  async findById(productOptionId) {
    const productOption = await ProductOption.findById({ _id: productOptionId });
    return productOption;
  }

  async findByName(productOptionName) {
    const productOption = await ProductOption.findOne({ name: productOptionName });
    return productOption;
  }

  async create(productOptionId) {
    const createdNew = await ProductOption.create(productOptionId);
    return createdNew;
  }

  async update({ productOptionId, update }) {
    const filter = { _id: productOptionId };
    const option = { returnOriginal: false };

    const updated = await ProductOption.findOneAndUpdate(filter, update, option);
    return updated;
  }

  async delete(productOptionId) {
    const del = await ProductOption.findOneAndDelete({ _id: productOptionId });
    return del;
  }

};

const productOptionModel = new ProductOptionModel();

export { productOptionModel };