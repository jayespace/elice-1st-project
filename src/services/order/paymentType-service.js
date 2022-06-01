import { paymentTypeModel } from '../../db';

class PaymentTypeService {

  constructor(paymentTypeModel) {
    this.paymentTypeModel = paymentTypeModel;
  }

  // 전체 payment Type 목록 확인
  async getAllPaymentType() {
    const allPaymentType = await this.paymentTypeModel.findAll();

    if (allPaymentType.length < 1) {
      throw new Error('payment Type가 없습니다.');
    }
    return allPaymentType;
  }

  // payment Type 상세 정보 확인
  async getPaymentType(paymentTypeId) {
    const paymentType = await this.paymentTypeModel.findById(paymentTypeId);

    if (!paymentType) {
      throw new Error('해당 payment Type 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    return paymentType;
  }

  // payment Type 이름으로 id 찾기
  async getPaymentTypeId(paymentTypeName) {
    const paymentType = await this.paymentTypeModel.findByName(paymentTypeName);

    if (!paymentType) {
      throw new Error('해당 payment Type 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const paymentTypeId = paymentType._id;
    return paymentTypeId;
  }

    // payment Type id로 이름 찾기
  async getPaymentTypeName(paymentTypeId) {
    const paymentType = await this.paymentTypeModel.findById(paymentTypeId);

    if (!paymentType) {
      throw new Error('해당 payment Type 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const paymentTypeName = paymentType.name;
    return paymentTypeName;
  }


  // payment Type 추가
  async addPaymentType(paymentTypeInfo) {
    const { name } = paymentTypeInfo;

    const isExist = await this.paymentTypeModel.findByName(name);
    if (isExist) {
        throw new Error('이 이름으로 생성된 payment Type가 있습니다. 다른 이름을 지어주세요.');
    }
    const newInfo = { name };
    // db에 저장
    const createdNew = await this.paymentTypeModel.create(newInfo);
    return createdNew;
  }

  // payment Type 정보 수정
  async setPaymentType(paymentTypeId, toUpdate) {
    let paymentType = await this.paymentTypeModel.findById(paymentTypeId);

    if (!paymentType) {
        throw new Error('해당 payment Type 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    
    paymentType = await this.paymentTypeModel.update({
        paymentTypeId,
        update: toUpdate,
    });

    return paymentType;
  }

// payment Type 삭제
  async deletePaymentType(paymentTypeId) {
    let paymentType = await this.paymentTypeModel.findById(paymentTypeId);

    if (!paymentType) {
        throw new Error('해당 payment Type 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    const del = await this.paymentTypeModel.delete(paymentTypeId);
    return del;
  }

};


const paymentTypeService = new PaymentTypeService(paymentTypeModel);

export { paymentTypeService };
