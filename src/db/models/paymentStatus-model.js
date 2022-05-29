import { model } from 'mongoose';
import { PaymentStatusSchema } from '../schemas/paymentStatus-schema';

const PaymentStatus = model('paymentStatus', PaymentStatusSchema);

export class PaymentStatusModel {

  async findAll() {
    const paymentStatus = await PaymentStatus.find({});
    return paymentStatus;
  }

  async findById(paymentStatusId) {
    const paymentStatus = await PaymentStatus.findById({ _id: paymentStatusId });
    return paymentStatus;
  }

  async findByName(paymentStatusName) {
    const paymentStatus = await PaymentStatus.findOne({ name: paymentStatusName });
    return paymentStatus;
  }

  async create(paymentStatusId) {
    const createdNew = await PaymentStatus.create(paymentStatusId);
    return createdNew;
  }

  async update({ paymentStatusId, update }) {
    const filter = { _id: paymentStatusId };
    const option = { returnOriginal: false };

    const updatedpaymentStatus = await PaymentStatus.findOneAndUpdate(filter, update, option);
    return updatedpaymentStatus;
  }

  async delete(paymentStatusId) {
    const del = await PaymentStatus.findOneAndDelete({ _id: paymentStatusId });
    return del;
  }

};

const paymentStatusModel = new PaymentStatusModel();

export { paymentStatusModel }; 