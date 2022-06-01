import { model } from 'mongoose';
import { PaymentTypeSchema } from '../../schemas/order/paymentType-schema';

const PaymentType = model('paymentType', PaymentTypeSchema);

export class PaymentTypeModel {

  async findAll() {
    const paymentTypes = await PaymentType.find({});
    return paymentTypes;
  }

  async findById(paymentTypeId) {
    const paymentType = await PaymentType.findById({ _id: paymentTypeId });
    return paymentType;
  }

  async findByName(paymentTypeName) {
    const paymentType = await PaymentType.findOne({ name: paymentTypeName });
    return paymentType;
  }

  async create(paymentTypeId) {
    const createdNew = await PaymentType.create(paymentTypeId);
    return createdNew;
  }

  async update({ paymentTypeId, update }) {
    const filter = { _id: paymentTypeId };
    const option = { returnOriginal: false };

    const updated = await PaymentType.findOneAndUpdate(filter, update, option);
    return updated;
  }

  async delete(paymentTypeId) {
    const del = await PaymentType.findOneAndDelete({ _id: paymentTypeId });
    return del;
  }

};

const paymentTypeModel = new PaymentTypeModel();

export { paymentTypeModel }; 