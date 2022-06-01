import { orderModel } from '../db';
import { userService } from './user-service';
import { productService } from './product-service';
import { csStatusService } from './csStatus-service';
import { orderStatusService } from './orderStatus-service';
import { orderServiceModule } from './module/order-service-module';

class OrderService {

  constructor(orderModel, userService, productService, csStatusService, orderStatusService, orderServiceModule) {
    this.orderModel = orderModel;
    this.userService = userService;
    this.productService = productService;
    this.csStatusService = csStatusService;
    this.orderStatusService = orderStatusService;
    this.orderServiceModule = orderServiceModule;
  }

  // 1. 전체 주문 갯수 확인
  async countTotalOrders() {
    const total = await this.orderModel.countOrders();

    if (total < 1) {
      throw new Error('주문이 없습니다.');
    }
    return total;
  }

  // 2. 전체 주문 목록 확인
  async getOrders() {
    const orders = await this.orderModel.findAll();

    if (orders.length < 1) {
      throw new Error('주문 내역이 없습니다.');
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
      // **** 유저 정보 가공 끝 ***

      /// orderedProducts의 정보로 제품 정보 가공
      let productInfo = [];
      const orderedProducts = orders[i].products;

      for(let i = 0; i < orderedProducts.length; i++) {
        const order_product_id = orderedProducts[i].product_id.valueOf();
        const orderQty = orderedProducts[i].qty

        // product_id로 product 정보를 가져와서 주문정보 array에 담음
        const product = await this.productService.getDetail(order_product_id);
        const {
          name,
          price
        } = product;
      
        const modifiedProduct = {
          name,
          price,
          qty: orderQty,
          totalPrice: price * orderQty
        }
        productInfo.push(modifiedProduct)
      }
      // ***** 제품 가공 끝 ************

      //// cs status & order status 이름 반환 작업
      const order_csStatus_id = orders[i].orderStatus.valueOf();
      const cs_csStatus_id = orders[i].csStatus.valueOf();
      const orderStatusName = await this.orderStatusService.getOrderStatusName(order_csStatus_id);
      const csStatusName = await this.csStatusService.getCsStatusName(cs_csStatus_id);

      const statusInfo = {
        orderStatus: orderStatusName,
        csStatus: csStatusName
      };
      ///////****** status 가공 끝 */
      const returnOrder = {
        orderInfo: orders[i],
        userInfo,
        productInfo,
        statusInfo
      };

      returnOrders.push(returnOrder)
    }

    return returnOrders;
  }

  // 3. 유저의 전체 주문 목록 확인
  async getOrdersByUser(userId) {
    const orders = await this.orderModel.findByUser(userId);

    if (orders.length < 1) {
      throw new Error('해당 사용자의 주문이 없습니다.');
    }

    /// ** db 목록에 있는 user_id로 user 정보를 가져와서 주문정보와 연결 **
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
      // *** 유저정보 가공 끝 ******

      /// ** orderedProducts의 정보로 제품 정보 가공 **
      let productInfo = [];
      const orderedProducts = orders[i].products;

      for(let i = 0; i < orderedProducts.length; i++) {
        const order_product_id = orderedProducts[i].product_id.valueOf();
        const orderQty = orderedProducts[i].qty

        // product_id로 product 정보를 가져와서 주문정보 array에 담음
        const product = await this.productService.getDetail(order_product_id);
        const {
          name,
          price
        } = product;
      
        const modifiedProduct = {
          name,
          price,
          qty: orderQty,
          totalPrice: price * orderQty
        }
        productInfo.push(modifiedProduct)
      }
      // ***** 제품 가공 끝 *****************

      //// cs status & order status 이름 반환 작업
      const order_csStatus_id = orders[i].orderStatus.valueOf();
      const cs_csStatus_id = orders[i].csStatus.valueOf();
      const orderStatusName = await this.orderStatusService.getOrderStatusName(order_csStatus_id);
      const csStatusName = await this.csStatusService.getCsStatusName(cs_csStatus_id);

      const statusInfo = {
        orderStatus: orderStatusName,
        csStatus: csStatusName
      };
      ///////****** status 가공 끝 */
      const returnOrder = {
        orderInfo: orders[i],
        userInfo,
        productInfo,
        statusInfo
      };

      /// 가공된 데이터 반환
      returnOrders.push(returnOrder);
    }

    return returnOrders;
  }

  // 4. 주문 상세정보 확인
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

    /// orderedProducts의 정보로 제품 정보 가공
    const orderedProducts = order.products;
    let productInfo = [];
    for(let i = 0; i < orderedProducts.length; i++) {
      const order_product_id = orderedProducts[i].product_id.valueOf();
      const orderQty = orderedProducts[i].qty

      // product_id로 product 정보를 가져와서 주문정보 array에 담음
      const product = await this.productService.getDetail(order_product_id);
      const {
        name,
        price
      } = product;
    
      const modifiedProduct = {
        name,
        price,
        qty: orderQty,
        totalPrice: price * orderQty
      }

      productInfo.push(modifiedProduct)
    }
    // ***** 제품 가공 끝 *****************

    //// cs status & order status 이름 반환 작업
    const order_orderStatus_id = order.orderStatus.valueOf();
    const order_csStatus_id = order.csStatus.valueOf();
    const orderStatusName = await this.orderStatusService.getOrderStatusName(order_orderStatus_id);
    const csStatusName = await this.csStatusService.getCsStatusName(order_csStatus_id);

    const statusInfo = {
      orderStatus: orderStatusName,
      csStatus: csStatusName
    };
    ///////****** status 가공 끝 */

    /// 유저, 주문, 제품 정보 담아서 return
    const returnOrder = {
      orderInfo: order,
      userInfo,
      productInfo,
      statusInfo
    };

    return returnOrder;
  }

  // 5. 주문 추가
  async addOrder(orderInfo) {

    let {
      user_id,
      fullNameTo,
      phoneNumberTo,
      addressTo,
      messageTo,
      products
    } = orderInfo;

    const neworderInfo = {
      user_id,
      fullNameTo,
      phoneNumberTo,
      addressTo,
      messageTo,
      products
    };
    
    // db에 주문 정보 저장
    const newOrder = await this.orderModel.create(neworderInfo);

    // user_id로 user 정보를 가져와서 가공
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

    /// 주문한 제품의 id로 제품 정보 가공
    let productInfo = [];
    for(let i = 0; i < products.length; i++) {
      const product_id = products[i].product_id
      const orderQty = products[i].qty

      /// db의 재고 수정
      const stock = await this.productService.modifyStock(product_id, orderQty);

      // product_id로 product 정보를 가져와서 주문정보 array에 담음
      const product = await this.productService.getDetail(product_id);
      const {
        name,
        price
      } = product;
    
      const modifiedProduct = {
        name,
        price,
        qty: orderQty,
        totalPrice: price * orderQty
      }

      productInfo.push(modifiedProduct)
    }
    // ***** 제품 가공 끝 *****************

    //// cs status & order status 이름 반환 작업
    const order_csStatus_id = newOrder.orderStatus.valueOf();
    const cs_csStatus_id = newOrder.csStatus.valueOf();
    const orderStatusName = await this.orderStatusService.getOrderStatusName(order_csStatus_id);
    const csStatusName = await this.csStatusService.getCsStatusName(cs_csStatus_id);

    const statusInfo = {
      orderStatus: orderStatusName,
      csStatus: csStatusName
    };
    ///////****** status 가공 끝 */

    /// 유저, 주문, 제품 정보 담아서 return
    const returnOrder = {
      orderInfo: newOrder,
      userInfo,
      productInfo,
      statusInfo
    };
    
    return returnOrder;
  }

  //// 6. 주문 정보 수정
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

    //// cs status & order status 이름 반환 작업
    const order_csStatus_id = order.orderStatus.valueOf();
    const cs_csStatus_id = order.csStatus.valueOf();
    const orderStatusName = await this.orderStatusService.getOrderStatusName(order_csStatus_id);
    const csStatusName = await this.csStatusService.getCsStatusName(cs_csStatus_id);

    const statusInfo = {
      orderStatus: orderStatusName,
      csStatus: csStatusName
    };
    ///////****** status 가공 끝 */

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

    /// orderedProducts의 정보로 제품 정보 가공
    const orderedProducts = order.products;
    let productInfo = [];
    for(let i = 0; i < orderedProducts.length; i++) {
      const order_product_id = orderedProducts[i].product_id.valueOf();
      const orderQty = orderedProducts[i].qty

      /// 만약 orderStatus가 취소/교환/반품 완료일 경우 db에 재고 돌려놈
      if (orderStatusName === ("취소완료" || "교환완료" || "반품완료")) {
        const modifyQty = -Math.abs(orderQty);
        const stock = await this.productService.modifyStock(order_product_id, modifyQty);
      }

      // product_id로 product 정보를 가져와서 주문정보 array에 담음
      const product = await this.productService.getDetail(order_product_id);
      const {
        name,
        price
      } = product;
    
      const modifiedProduct = {
        name,
        price,
        qty: orderQty,
        totalPrice: price * orderQty
      }

      productInfo.push(modifiedProduct);
    }
    // ***** 제품 가공 끝 *****************

    /// 유저, 주문, 제품 정보 담아서 return
    const returnOrder = {
      orderInfo: order,
      userInfo,
      productInfo,
      statusInfo
    };

    return returnOrder;
  };

  /// 7. order id로 검색하여 orderStatus id, name 찾기
  async getCurrentOrderStatus(orderId) {
    let order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new Error('해당 주문 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const order_orderStatus_id = order.orderStatus.valueOf();
    const orderStatusName = await this.orderStatusService.getOrderStatusName(order_orderStatus_id);

    const orderStatusinfo = {
      id: order_orderStatus_id,
      name: orderStatusName
    }
    return orderStatusinfo;
  }


  /// 8. order id로 검색하여 csStatus orderStatus id, name 찾기
  async getCurrentCsStatus(orderId) {
    let order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new Error('해당 주문 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const order_csStatus_id = order.csStatus.valueOf();
    const csStatusName = await this.csStatusService.getCsStatusName(order_csStatus_id);

    const csStatusinfo = {
      id: order_csStatus_id,
      name: csStatusName
    }
    return csStatusinfo;
    }

  //// 9. 특정 주문의 userId 반환
  async getOrderUserId(orderId) {
    let order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new Error('해당 주문 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    
    const order_user_id = order.user_id.valueOf();
    return order_user_id;
  }

};


const orderService = new OrderService(
  orderModel,
  userService,
  productService,
  csStatusService, 
  orderStatusService,
  orderServiceModule
);

export { orderService };
