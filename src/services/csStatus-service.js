import { csStatusModel, orderStatusModel } from '../db';

class CsStatusService {

  constructor(csStatusModel, orderStatusModel) {
    this.csStatusModel = csStatusModel;
    this.orderStatusModel = orderStatusModel;
  };

  // 전체 CS Status 목록 확인
  async getAllCsStatus() {
    const allCsStatus = await this.csStatusModel.findAll();

    if (allCsStatus.length < 1) {
      throw new Error('CS Status가 없습니다.');
    };
    return allCsStatus;
  };

  // CS Status 상세 정보 확인
  async getCsStatus(csStatusId) {
    const csStatus = await this.csStatusModel.findById(csStatusId);

    if (!csStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    };

    return csStatus;
  };

  // 이름으로 Cs Status 정보 확인
  async getCsStatusByName(name) {
    const csStatus = await this.csStatusModel.findByName(name);
    return csStatus;
  };

  // CS Status 이름으로 id 찾기
  async getCsStatusId(csStatusName) {
    const csStatus = await this.csStatusModel.findByName(csStatusName);

    if (!csStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    };

    const csStatusId = csStatus._id.valueOf();
    return csStatusId;
  };

  // CS Status id로 이름 찾기
  async getCsStatusName(csStatusId) {
    
    const csStatus = await this.csStatusModel.findById(csStatusId);

    if (!csStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    };
    const csStatusName = csStatus.name;

    return csStatusName;
  };

  // CS Status 추가
  async addCsStatus(csStatusInfo) {
    const { name } = csStatusInfo;

    const isExist = await this.csStatusModel.findByName(name);
    if (isExist) {
      throw new Error('이 이름으로 생성된 CS Status가 있습니다. 다른 이름을 지어주세요.');
    };
    const newInfo = { name };
    // db에 저장
    const createdNew = await this.csStatusModel.create(newInfo);
    return createdNew;
  };

  // CS Status 정보 수정
  async setCsStatus(csStatusId, toUpdate) {
    let csStatus = await this.csStatusModel.findById(csStatusId);

    if (!csStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    };
    
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
    };
    const del = await this.csStatusModel.delete(csStatusId);
    return del;
  };

    /// 카테고리 id로 정보 조회
    async isExist(categoryId) {

      const products = await this.productModel.findByCategoryId(categoryId);
      return products;
    }

  // *** CS Status와 Order Status 체크하여 ID 반환 ****
  async adjustStatus(reqCsStatusId, curCsStatusId, curOrderStatusId) {
    //// 요청한 CS STATUS 확인
    const reqCsStatus = await this.csStatusModel.findById(reqCsStatusId);

    if (!reqCsStatus) {
        throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    };

    const reqCsStatusName = reqCsStatus.name;

    //// 현재 CS STATUS 확인
    const curCsStatus = await this.csStatusModel.findById(curCsStatusId);

    if (!curCsStatus) {
        throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    };

    const curCsStatusName = curCsStatus.name;

    /// 현재 Order Status 확인
    const curOrderStatus = await this.orderStatusModel.findById(curOrderStatusId);

    if (!curOrderStatus) {
      throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    };
    const curOrderStatusName = curOrderStatus.name;

    /// 사용자 로직
    if (reqCsStatusName === "정상") {
      throw new Error ('해당 요청 사항은 반영될 수 없습니다.'); 
    };

    if (reqCsStatusName === "취소"){
      if(curCsStatusName !== "정상") {
        throw new Error ('현재 요청 상태를 다시 한번 확인해 주세요.');
      } else if (curOrderStatusName === '취소완료') {
        throw new Error ('현재 주문 진행 상태를 다시 한번 확인해 주세요.')
      } else if (curOrderStatusName !== '결제완료' && curOrderStatusName !== '상품준비중') {
        throw new Error ('현재 주문 진행 상태에서는 주문을 취소할 수 없습니다.')
      };
    };

    if (reqCsStatusName === "교환" || reqCsStatusName === "반품"){
      if(curCsStatusName !== "정상") {
        throw new Error ('현재 요청 상태를 다시 한번 확인해 주세요.');
      } else if(curOrderStatusName !== "배송중" && curOrderStatusName !== "배송완료") {
        throw new Error ('현재 주문 진행 상태를 다시 한번 확인해 주세요.'); 
      };
    };

    const statusinfo = {
      orderStatus: curOrderStatusId,
      csStatus: reqCsStatusId
    };
    return statusinfo;
  };

};


const csStatusService = new CsStatusService(csStatusModel, orderStatusModel);

export { csStatusService };
