import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('orders', OrderSchema);

export class OrderModel {

  async findAll() {
    const orders = await Order.find({});
    return orders;
  }

  async findById(orderId) {
    const order = await Order.findById({ _id: orderId });
    return order;
  }

  async findByUser(userId) {
    const order = await Order.find({ "user.user_id": userId });
    return order;
  }

  async countOrders() {
    const counts = await Order.countDocuments({})
    return counts;
  }

  async countOrdersByUser(userId) {
    const counts = await Order.countDocuments({ user_id : userId })
    return counts;
  }

  async create(orderId) {
    const createdNew = await Order.create(orderId);
    return createdNew;
  }

  async update({ orderId, update }) {
    const filter = { _id: orderId };
    const option = { returnOriginal: false };

    const updated = await Order.findOneAndUpdate(filter, update, option);
    return updated;
  }

};

const orderModel = new OrderModel();

export { orderModel };