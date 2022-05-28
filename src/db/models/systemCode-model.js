import { model } from 'mongoose';
import { SystemCodeSchema } from '../schemas/systemCode-schema';

const SystemCode = model('systemCode', SystemCodeSchema);

export class SystemCodeModel {

  async findAll() {
    const systemCodes = await SystemCode.find({});
    return systemCodes;
  }

  async findById(systemCodeId) {
    const systemCode = await SystemCode.findById({ _id: systemCodeId });
    return systemCode;
  }

  async findByName(name) {
    const systemCode = await SystemCode.findOne({ name: name });
    return systemCode;
  }

  async countSystemCodes() {
    const counts = await SystemCode.countDocuments({})
    return counts;
  }

  async create(systemCodeInfo) {
    const createdNew = await SystemCode.create(systemCodeInfo);
    return createdNew;
  }

  async update({ systemCodeId, update }) {
    const filter = { _id: systemCodeId };
    const option = { returnOriginal: false };

    const updatedSystemCode = await SystemCode.findOneAndUpdate(filter, update, option);
    return updatedSystemCode;
  }

  async delete(systemCodeId) {
    const deleteSystemCode = await SystemCode.findOneAndDelete({ _id: systemCodeId });
    return deleteSystemCode;
  }

};

const systemCodeModel = new SystemCodeModel();

export { systemCodeModel };