import { csStatusModel } from '../db';
import { orderStatusService} from './orderStatus-service';

class CsStatusService {

  constructor(csStatusModel, orderStatusService) {
    this.csStatusModel = csStatusModel;
    this.orderStatusService = orderStatusService;
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

    const csStatusId = csStatus._id.valueOf();
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

  // *** CS Status와 Order Status 체크하여 ID 반환 ****
  async checkCsStatus(csStatusId, orderStatusId) {

    let currentCsStatusId = csStatusId;
    let currentOrderStatusId = orderStatusId;

    const csStatus = await this.csStatusModel.findById(csStatusId);

    if (!csStatus) {
        throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    //// 현재 CS STATUS 확인
    const csStatusName = csStatus.name;
    /// 현재 Order Status 확인
    const orderStatusName = await this.orderStatusService.getOrderStatusName(orderStatusId);

    if (csStatusName === ("교환요청" || "반품요청")) {
      if(orderStatusName !== ("배송중" || "배송완료")) {
        throw new Error ('현재 주문 상태를 확인해주세요');
      }
    }
    //// Cs Status가 "정상"인 cs status id 값
    const defaultCsStatusId = "62958fdb0408c67d1e8d3653";
    // Order Status "취소완료" 
    const cancelconfirmedorderStatusId = "629590e888e88a5137884dd8"

    /// 유저는 결제완료일때만 취소요청 할 시 order Status를 취소완료로 변경할 수 있음
    if (csStatusName === "취소요청" || orderStatusName === '결제완료') {
      currentCsStatusId = defaultCsStatusId;
      currentOrderStatusId = cancelconfirmedorderStatusId;
    }
    
    return ([currentCsStatusId, currentOrderStatusId]);
  };

};


const csStatusService = new CsStatusService(csStatusModel, orderStatusService);

export { csStatusService };
