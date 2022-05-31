import { orderStatusModel } from '../db';
import { csStatusService } from './csStatus-service';

class OrderStatusService {

  constructor(orderStatusModel, csStatusService, orderService) {
    this.orderStatusModel = orderStatusModel;
    this.csStatusService = csStatusService;
  }

  // 전체 order Status 목록 확인
  async getAllOrderStatus() {
    const allOrderStatus = await this.orderStatusModel.findAll();

    if (allOrderStatus.length < 1) {
      throw new Error('order Status가 없습니다.');
    }
    return allOrderStatus;
  }

  // order Status 상세 정보 확인
  async getOrderStatus(orderStatusId) {
    const orderStatus = await this.orderStatusModel.findById(orderStatusId);

    if (!orderStatus) {
      throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    return orderStatus;
  }

  // order Status 이름으로 id 찾기
  async getOrderStatusId(orderStatusName) {
    const orderStatus = await this.orderStatusModel.findByName(orderStatusName);

    if (!orderStatus) {
      throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const orderStatusId = orderStatus._id.valueOf();
    return orderStatusId;
  }

    // order Status id로 이름 찾기
  async getOrderStatusName(orderStatusId) {
    const orderStatus = await this.orderStatusModel.findById(orderStatusId);

    if (!orderStatus) {
      throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const orderStatusName = orderStatus.name;
    return orderStatusName;
  }


  // order Status 추가
  async addOrderStatus(orderStatusInfo) {
    const { name } = orderStatusInfo;

    const isExist = await this.orderStatusModel.findByName(name);
    if (isExist) {
        throw new Error('이 이름으로 생성된 order Status가 있습니다. 다른 이름을 지어주세요.');
    }
    const newInfo = { name };
    // db에 저장
    const createdNew = await this.orderStatusModel.create(newInfo);
    return createdNew;
  }

  // order Status 정보 수정
  async setOrderStatus(orderStatusId, toUpdate) {
    let orderStatus = await this.orderStatusModel.findById(orderStatusId);

    if (!orderStatus) {
        throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    
    orderStatus = await this.orderStatusModel.update({
        orderStatusId,
        update: toUpdate,
    });

    return orderStatus;
  }

  // order Status 삭제
  async deleteOrderStatus(orderStatusId) {
    let orderStatus = await this.orderStatusModel.findById(orderStatusId);

    if (!orderStatus) {
        throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    const del = await this.orderStatusModel.delete(orderStatusId);
    return del;
  }

  // *** Order Status와 CS Status 체크하여 ID 반환 ****
  async adjustStatus(orderStatusId, csStatusId) {

    let currentOrderStatusId = orderStatusId;
    let currentCsStatusId = csStatusId;
    console.log(csStatusId)
    
    const orderStatus = await this.orderStatusModel.findById(orderStatusId);

    if (!orderStatus) {
        throw new Error('해당 Order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    //// 현재 Order STATUS 확인
    const orderStatusName = orderStatus.name;
    /// 현재 CS Status 확인
    const csStatusName = await this.csStatusService.getCsStatusName(csStatusId);

    //// 변경할 Cs Status default"정상" id 값 
    const csStatusDefaultId = "S62958fdb0408c67d1e8d3653"

    /// 관리자 로직 구현 필요
    if (orderStatusName === "배송중") {
      if (csStatusName === '취소') {
          throw new Error ('구매자의 요청사항을 확인해 주세요.')
      }
    } 
    
    if (orderStatusName === "배송완료") {
      if (csStatusName === '교환요청' || "반품요청") {
        throw new Error ('구매자의 요청사항을 확인해 주세요.');
      }
    } 

    if (orderStatusName === ('결제완료' ||'취소완료' || "교환완료"|| "반품완료")) {
      currentCsStatusId = csStatusDefaultId
    } 
    
    const statusinfo = {
      orderStatus: currentOrderStatusId,
      csStatus: currentCsStatusId
    }
    return statusinfo;
  };

};


const orderStatusService = new OrderStatusService(orderStatusModel, csStatusService);

export { orderStatusService };
