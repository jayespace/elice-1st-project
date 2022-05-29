import { model } from 'mongoose';
import { CsStatusSchema } from '../../schemas/order/csStatus-schema';

const CsStatus = model('csStatus', CsStatusSchema);

export class CsStatusModel {

  async findAll() {
    const allCsStatus = await CsStatus.find({});
    return allCsStatus;
  }

  async findById(csStatusId) {
    const csStatus = await CsStatus.findById({ _id: csStatusId });
    return csStatus;
  }

  async findByName(csStatusName) {
    const csStatus = await CsStatus.findOne({ name: csStatusName });
    return csStatus;
  }

  async create(csStatusInfo) {
    const createdNew = await CsStatus.create(csStatusInfo);
    return createdNew;
  }

  async update({ csStatusId, update }) {
    const filter = { _id: csStatusId };
    const option = { returnOriginal: false };

    const updated = await CsStatus.findOneAndUpdate(filter, update, option);
    return updated;
  }

  async delete(csStatusId) {
    const del = await CsStatus.findOneAndDelete({ _id: csStatusId });
    return del;
  }

};

const csStatusModel = new CsStatusModel();

export { csStatusModel };