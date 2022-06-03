import { orderStatusModel, csStatusModel } from '../db';


class OrderStatusService {

  constructor(orderStatusModel, csStatusModel) {
    this.orderStatusModel = orderStatusModel;
    this.csStatusModel = csStatusModel;
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

  // 이름으로 order Status 정보 확인
  async getOrderStatusByName(name) {
    const orderStatus = await this.orderStatusModel.findByName(name);
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
  async adjustStatus(reqOrderStatusId, curOrderStatusId, curCsStatusId) {

    //// 요청한 Order STATUS 확인
    const reqOrderStatus = await this.orderStatusModel.findById(reqOrderStatusId);

    if (!reqOrderStatus) {
      throw new Error('해당 Order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const reqOrderStatusName = reqOrderStatus.name;

    //// 현재 Order STATUS 확인
    const curOrderStatus = await this.orderStatusModel.findById(curOrderStatusId);

    if (!curOrderStatus) {
      throw new Error('해당 Order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const curOrderStatusName = curOrderStatus.name;

    /// 현재 CS Status 확인
    const curCsStatus = await this.csStatusModel.findById(curCsStatusId);

    if (!curCsStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    const curCsStatusName = curCsStatus.name;

    /// 관리자 로직
    if (reqOrderStatusName === "결제완료") {
      throw new Error ('해당 요청 사항은 반영될 수 없습니다.'); 
    }

    if (reqOrderStatusName === "취소완료") {
      if (curOrderStatusName !== '결제완료' && curOrderStatusName !== '상품준비중') {
        throw new Error ('해당 요청 사항은 반영될 수 없습니다.')
      } else if (curCsStatusName !== '취소') {
        throw new Error ('구매자의 요청 사항을 확인해 주세요.')
      }
    } 

    if (reqOrderStatusName === "상품준비중") {
      if (curOrderStatusName !== '결제완료') {
        throw new Error ('해당 요청 사항은 반영될 수 없습니다.')
      } else if (curCsStatusName === '취소') {
        throw new Error ('구매자의 요청 사항을 확인해 주세요.')
      }
    } 

    if (reqOrderStatusName === "배송중") {
      if (curOrderStatusName !== '상품준비중') {
        throw new Error ('해당 요청 사항은 반영될 수 없습니다.')
      }
    } 

    if (reqOrderStatusName === "배송완료") {
      if (curOrderStatusName !== '배송중') {
        throw new Error ('해당 요청 사항은 반영될 수 없습니다.')
      } else if (curCsStatusName === '교환' && curCsStatusName === "반품") {
        throw new Error ('구매자의 요청사항을 확인해 주세요.');
      }
    } 

    if (reqOrderStatusName === "교환진행중") {
      if (curOrderStatusName !== '배송중' && curOrderStatusName !== '배송완료') {
        throw new Error ('해당 요청 사항은 반영될 수 없습니다.')
      } else if (curCsStatusName !== '교환') {
        throw new Error ('구매자의 요청사항을 확인해 주세요.');
      }
    } 

    if (reqOrderStatusName === "교환완료") {
      if (curOrderStatusName !== '교환진행중') {
        throw new Error ('해당 요청 사항은 반영될 수 없습니다.')
      }
    } 

    if (reqOrderStatusName === "반품진행중") {
      if (curOrderStatusName !== '배송중' && curOrderStatusName !== '배송완료') {
        throw new Error ('해당 요청 사항은 반영될 수 없습니다.')
      } else if (curCsStatusName !== '반품') {
        throw new Error ('구매자의 요청사항을 확인해 주세요.');
      }
    } 

    if (reqOrderStatusName === "반품완료") {
      if (curOrderStatusName !== '반품진행중') {
        throw new Error ('해당 요청 사항은 반영될 수 없습니다.')
      }
    } 

    const statusinfo = {
      orderStatus: reqOrderStatusId,
      csStatus: curCsStatusId
    }
    return statusinfo;
  };

};


const orderStatusService = new OrderStatusService(orderStatusModel, csStatusModel);

export { orderStatusService };