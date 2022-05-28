import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {

  async countProducts() {
    const counts = await Product.countDocuments({})
    return counts;
  }

  async countbyCategory(category) {
    const counts = await Product.countDocuments({ category });
    return counts;
  }

  async countbyManufacturer(manufacturer) {
    const counts = await Product.countDocuments({ manufacturer });
    return counts;
  }

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

  async findByPrice(priceRange) {
    const products = await Product.find({ price: priceRange });
    return products;
  }

  async findByKeyword(keyword) {
    const products = await Product.find({ keyword });
    return products;
  }

  async findAllbyPage(page, perPage) {
    const products = await Product
                              .find({})
                              .sort({ createdAt : -1 })
                              .skip(perPage * (page - 1))
                              .limit(perPage);
    return products;
  }

  async findByCategory(category, page, perPage) {
    const products = await Product
                              .find({ category })
                              .sort({ createdAt : -1 })
                              .skip(perPage * (page - 1))
                              .limit(perPage);
    return products;
  }

  async findByManufacturer(manufacturer, page, perPage) {
    const products = await Product
                              .find({ manufacturer })
                              .sort({ createdAt : -1 })
                              .skip(perPage * (page - 1))
                              .limit(perPage);
    return products;
  }

  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }

  async update({ productId, update }) {
    const filter = { _id: productId };
    const option = { returnOriginal: false };

    const updatedProduct = await Product.findOneAndUpdate(filter, update, option);
    return updatedProduct;
  }

  async delete(productId) {
    await Product.findOneAndDelete({ _id: productId });
    return;
  }

};

const productModel = new ProductModel();

export { productModel };