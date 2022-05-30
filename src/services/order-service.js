import { orderModel } from '../db';
import { userService } from './user-service';

class OrderService {

  constructor(orderModel) {
    this.orderModel = orderModel;
    this.userService = userService;
  }

  // 전체 주문 갯수 확인
  async countTotalOrders() {
    const total = await this.orderModel.countOrders();

    if (total < 1) {
      throw new Error('주문이 없습니다.');
    }
    return total;
  }

  // 전체 주문 목록 확인
  async getOrders() {
    const orders = await this.orderModel.findAll();

    if (orders.length < 1) {
      throw new Error('주문이 없습니다.');
    }

    /// db 목록에 있는 user_id로 user 정보를 가져와서 주문정보와 연결
    let returnOrders = [];
    for(let i = 0; i < orders.length; i++){
      const order_user_id = orders[i].user_id.valueOf();

      const user = await this.userService.getUser(order_user_id);
      const {
        fullName,
        phoneNumber,
        email } = user;
    
      const userInfo = {
        fullName,
        phoneNumber,
        email
      }
      returnOrders.push([userInfo, orders[i]])
    }

    return returnOrders;
  }

  // 유저의 전체 주문 목록 확인
  async getOrdersByUser(userId) {
    const orders = await this.orderModel.findByUser(userId);

    if (orders.length < 1) {
      throw new Error('주문이 없습니다.');
    }

    /// db 목록에 있는 user_id로 user 정보를 가져와서 주문정보와 연결
    let returnOrders = [];
    for(let i = 0; i < orders.length; i++){
      const order_user_id = orders[i].user_id.valueOf();

      const user = await this.userService.getUser(order_user_id);
      const {
        fullName,
        phoneNumber,
        email } = user;
    
      const userInfo = {
        fullName,
        phoneNumber,
        email
      }
      returnOrders.push([userInfo, orders[i]])
    }

    return returnOrders;
  }

  // 주문 상세정보 확인
  async getOrder(orderId) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new Error('해당 주문 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    /// db 목록에 있는 user_id로 user 정보를 가져와서 주문정보와 연결
    const order_user_id = order.user_id.valueOf();
    const user = await this.userService.getUser(order_user_id);
    const {
      fullName,
      phoneNumber,
      email } = user;
  
    const userInfo = {
      fullName,
      phoneNumber,
      email
    }

    const returnOrder = [userInfo, order]
    return returnOrder;
  }

  // 주문 추가
  async addOrder(orderInfo) {

    let {
      user_id,
      fullNameTo,
      phoneNumberTo,
      addressTo,
      messageTo,
      orderedProducts 
    } = orderInfo;

    const neworderInfo = {
      user_id,
      fullNameTo,
      phoneNumberTo,
      addressTo,
      messageTo,
      orderedProducts 
    };
    
    // db에 저장
    const newOrder = await this.orderModel.create(neworderInfo);

    // user_id로 user 정보를 가져와서 주문정보와 연결
    const user = await this.userService.getUser(user_id);
    const {
      fullName,
      phoneNumber,
      email } = user;
  
    const userInfo = {
      fullName,
      phoneNumber,
      email
    }

    const returnOrder = [userInfo, newOrder]
    return returnOrder;
  }

  // 주문 정보 수정
  async setOrder(orderId, toUpdate) {
    let order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new Error('해당 주문 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    
    order = await this.orderModel.update(
      {
        orderId,
        update: toUpdate,
      }
    );

    return order;
  }
};


const orderService = new OrderService(orderModel, userService);

export { orderService };
