import { model } from 'mongoose';
import { OrderStatusSchema } from '../schemas/orderStatus-schema';

const OrderStatus = model('orderStatus', OrderStatusSchema);

export class OrderStatusModel {

  async findAll() {
    const orderStatus = await OrderStatus.find({});
    return orderStatus;
  }

  async findById(orderStatusId) {
    const orderStatus = await OrderStatus.findById({ _id: orderStatusId });
    return orderStatus;
  }

  async findByName(orderStatusName) {
    const orderStatus = await OrderStatus.findOne({ name: orderStatusName });
    return orderStatus;
  }

  async create(orderStatusInfo) {
    const createdNew = await OrderStatus.create(orderStatusInfo);
    return createdNew;
  }

  async update({ orderStatusId, update }) {
    const filter = { _id: orderStatusId };
    const option = { returnOriginal: false };

    const updated = await OrderStatus.findOneAndUpdate(filter, update, option);
    return updated;
  }

  async delete(orderStatusId) {
    const del = await OrderStatus.findOneAndDelete({ _id: orderStatusId });
    return del;
  }

};

const orderStatusModel = new OrderStatusModel();

export { orderStatusModel }; 