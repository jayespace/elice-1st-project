import { csStatusModel } from '../db';

class CsStatusService {

  constructor(csStatusModel) {
    this.csStatusModel = csStatusModel;
  }

  // 전체 CS Status 목록 확인
  async getAllCsStatus() {
    const allCsStatus = await this.csStatusModel.findAll();

    if (allCsStatus.length < 1) {
      throw new Error('CS Status가 없습니다.');
    }
    return allCsStatus;
  }

  // CS Status 상세 정보 확인
  async getCsStatus(csStatusId) {
    const csStatus = await this.csStatusModel.findById(csStatusId);

    if (!csStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    return csStatus;
  }

  // CS Status 이름으로 id 찾기
  async getCsStatusId(csStatusName) {
    const csStatus = await this.csStatusModel.findByName(csStatusName);

    if (!csStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const csStatusId = csStatus._id;
    return csStatusId;
  }

    // CS Status id로 이름 찾기
  async getCsStatusName(csStatusId) {
    const csStatus = await this.csStatusModel.findById(csStatusId);

    if (!csStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const csStatusName = csStatus.name;
    return csStatusName;
  }


  // CS Status 추가
  async addCsStatus(csStatusInfo) {
    const { name } = csStatusInfo;

    const isExist = await this.csStatusModel.findByName(name);
    if (isExist) {
        throw new Error('이 이름으로 생성된 CS Status가 있습니다. 다른 이름을 지어주세요.');
    }
    const newInfo = { name };
    // db에 저장
    const createdNew = await this.csStatusModel.create(newInfo);
    return createdNew;
  }

  // CS Status 정보 수정
  async setCsStatus(csStatusId, toUpdate) {
    let csStatus = await this.csStatusModel.findById(csStatusId);

    if (!csStatus) {
        throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    
    csStatus = await this.csStatusModel.update({
        csStatusId,
        update: toUpdate,
    });

    return csStatus;
  }

// CS Status 삭제
  async deleteCsStatus(csStatusId) {
    let csStatus = await this.csStatusModel.findById(csStatusId);

    if (!csStatus) {
        throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    const del = await this.csStatusModel.delete(csStatusId);
    return del;
  }

};


const csStatusService = new CsStatusService(csStatusModel);

export { csStatusService };
