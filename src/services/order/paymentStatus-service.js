import { paymentStatusModel } from '../../db';

class PaymentStatusService {

  constructor(paymentStatusModel) {
    this.paymentStatusModel = paymentStatusModel;
  }

  // 전체 payment Status 목록 확인
  async getAllPaymentStatus() {
    const allPaymentStatus = await this.paymentStatusModel.findAll();

    if (allPaymentStatus.length < 1) {
      throw new Error('payment Status가 없습니다.');
    }
    return allPaymentStatus;
  }

  // payment Status 상세 정보 확인
  async getPaymentStatus(paymentStatusId) {
    const paymentStatus = await this.paymentStatusModel.findById(paymentStatusId);

    if (!paymentStatus) {
      throw new Error('해당 payment Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    return paymentStatus;
  }

  // payment Status 이름으로 id 찾기
  async getPaymentStatusId(paymentStatusName) {
    const paymentStatus = await this.paymentStatusModel.findByName(paymentStatusName);

    if (!paymentStatus) {
      throw new Error('해당 payment Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const paymentStatusId = paymentStatus._id;
    return paymentStatusId;
  }

    // payment Status id로 이름 찾기
  async getPaymentStatusName(paymentStatusId) {
    const paymentStatus = await this.paymentStatusModel.findById(paymentStatusId);

    if (!paymentStatus) {
      throw new Error('해당 payment Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const paymentStatusName = paymentStatus.name;
    return paymentStatusName;
  }


  // payment Status 추가
  async addPaymentStatus(paymentStatusInfo) {
    const { name } = paymentStatusInfo;

    const isExist = await this.paymentStatusModel.findByName(name);
    if (isExist) {
        throw new Error('이 이름으로 생성된 payment Status가 있습니다. 다른 이름을 지어주세요.');
    }
    const newInfo = { name };
    // db에 저장
    const createdNew = await this.paymentStatusModel.create(newInfo);
    return createdNew;
  }

  // payment Status 정보 수정
  async setPaymentStatus(paymentStatusId, toUpdate) {
    let paymentStatus = await this.paymentStatusModel.findById(paymentStatusId);

    if (!paymentStatus) {
        throw new Error('해당 payment Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    
    paymentStatus = await this.paymentStatusModel.update({
        paymentStatusId,
        update: toUpdate,
    });

    return paymentStatus;
  }

// payment Status 삭제
  async deletePaymentStatus(paymentStatusId) {
    let paymentStatus = await this.paymentStatusModel.findById(paymentStatusId);

    if (!paymentStatus) {
        throw new Error('해당 payment Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    const del = await this.paymentStatusModel.delete(paymentStatusId);
    return del;
  }

};


const paymentStatusService = new PaymentStatusService(paymentStatusModel);

export { paymentStatusService };
