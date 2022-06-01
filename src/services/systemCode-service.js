import { systemCodeModel } from '../db';


class SystemCodeModelService {

  constructor(systemCodeModel) {
    this.systemCodeModel = systemCodeModel;
  }

  async countTotalSystemCodes() {
    const total = await this.systemCodeModel.countSystemCodes();

    if (total < 1) {
        throw new Error('code가 없습니다.');
    }
    return total;
  }

  // 전체 시스템코드 목록 확인
  async getSystemCodes() {
    const systemCodes = await this.systemCodeModel.findAll();

    if (systemCodes.length < 1) {
      throw new Error('시스템코드가 없습니다.');
    }
    return systemCodes;
  }

  // 시스템코드 상세정보 확인
  async getSystemCode(systemCodeId) {
    const systemCode = await this.systemCodeModel.findById(systemCodeId);

    if (!systemCode) {
      throw new Error('시스템 코드가 없습니다.');
    }

    return systemCode;
  }

  // 시스템코드 추가
  async addSystemCode(systemCodeInfo) {
    const { name, desc } = systemCodeInfo;

    const isExist = await this.systemCodeModel.findByName(name);
    if (isExist) {
        throw new Error('이 이름으로 생성된 시스템코드가 있습니다. 다른 이름을 지어주세요.');
    }
    // db에 저장
    const createdNewSystemCode = await this.systemCodeModel.create(systemCodeInfo);
    return createdNewSystemCode;
  }

  // 시스템코드 정보 수정
  async setSystemCode(systemCodeId, toUpdate) {
    let systemCode = await this.systemCodeModel.findById(systemCodeId);

    if (!systemCode) {
        throw new Error('해당 시스템코드 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    
    systemCode = await this.systemCodeModel.update({
        systemCodeId,
        update: toUpdate,
    });

    return systemCode;
  }

// 시스템코드 삭제
  async deleteSystemCode(systemCodeId) {
    let systemCode = await this.systemCodeModel.findById(systemCodeId);

    if (!systemCode) {
        throw new Error('해당 시스템코드 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    systemCode = await this.systemCodeModel.delete(systemCodeId);
    return systemCode;
  }
}

const systemCodeService = new SystemCodeModelService(systemCodeModel);

export { systemCodeService };
