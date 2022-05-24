import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {

  async findAll() {
    const products = await Product.find({});
    return products;
  }

  async findByName(productName) {
    const product = await Product.findOne({ name: productName });
    return product;
  }

  async findById(productId) {
    const product = await Product.findById({ _id: productId });
    return product;
  }

  async findByCategory(category) {
    const filtered = await Product.find({ category });
    return filtered;
  }

  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }

  async update({ productId, update }) {
    const filter = { _id: productId };
    const option = { returnOriginal: false };

    const updatedProduct = await User.findOneAndUpdate(filter, update, option);
    return updatedProduct;
  }

  async delete(productId) {
    await Product.findOneAndDelete({ _id: productId });
    return;
  }
};

const productModel = new ProductModel();

export { productModel };