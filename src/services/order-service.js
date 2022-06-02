import { orderModel, userModel, productModel, csStatusModel, orderStatusModel } from '../db';

class OrderService {

  constructor(orderModel, userModel, productModel, csStatusModel, orderStatusModel) {
    this.orderModel = orderModel;
    this.userModel = userModel;
    this.productModel = productModel;
    this.csStatusModel = csStatusModel;
    this.orderStatusModel = orderStatusModel;
  }

  /// [1] 전체 주문 목록 확인
  async getOrders() {
    const orders = await this.orderModel.findAll();

    if (orders.length < 1) {
      throw new Error('주문 내역이 없습니다.');
    }

    /// ** db 목록에 있는 user_id로 user 정보를 가져와서 주문정보와 연결 **
    let returnOrders = [];
    for(let i = 0; i < orders.length; i++){

      // const order_user_id = orders[i].user_id.valueOf();
      // let user = await this.userModel.findById(order_user_id);
      // let userInfo;

      // db에서 찾지 못한 경우, unknown으로 정보 반환
      // if (!user) {
      //   userInfo = {
      //     fullName: "탈퇴한 사용자",
      //     phoneNumber: "unknown",
      //     email: "unknown"
      //   };
      // } else {
      //   const {
      //     fullName,
      //     phoneNumber,
      //     email } = user;

      //     userInfo = {
      //       fullName,
      //       phoneNumber,
      //       email
      //     }
      // }

      // // *** 유저정보 가공 끝 ******

      /// ** orderedProducts의 정보로 제품 정보 가공 **
      // let productInfo = [];
      // const orderedProducts = orders[i].products;

      // for(let i = 0; i < orderedProducts.length; i++) {
      //   const order_product_id = orderedProducts[i].product_id.valueOf();
      //   const orderQty = orderedProducts[i].qty
      //   const orderPrice = orderedProducts[i].price

      //   // product_id로 product 정보를 가져와서 주문정보 array에 담음
      //   const product = await this.productModel.findById(order_product_id);

      //   let name;

      //   if (!product) {
      //     name = "삭제된 상품입니다"
      //   } else {
      //     name = product.name;
      //   }

      //   const modifiedProduct = {
      //     name,
      //     price,
      //     qty: orderQty,
      //     totalPrice: orderPrice
      //   }

      //   productInfo.push(modifiedProduct)
      // }
      // ***** 제품 가공 끝 *****************

      //// ******* cs status & order status 이름 반환 작업
      ///// order status id로 이름 반환
      const order_orderStatus_id = orders[i].orderStatus.valueOf();
      const orderStatus = await this.orderStatusModel.findById(order_orderStatus_id);

      if (!orderStatus) {
        throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
      }

      const orderStatusName = orderStatus.name;

      ///// cs status id로 이름 반환
      const order_csStatus_id = orders[i].csStatus.valueOf();
      const csStatus = await this.csStatusModel.findById(order_csStatus_id);

      if (!csStatus) {
        throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
      }

      const csStatusName = csStatus.name;

      const statusInfo = {
        orderStatus: orderStatusName,
        csStatus: csStatusName
      };
      ///////****** status 가공 끝 */

      const returnOrder = {
        orderInfo: orders[i],
        // userInfo,
        // productInfo,
        statusInfo
      };

      /// 가공된 데이터 반환
      returnOrders.push(returnOrder);
    }

    return returnOrders;
  }

  // [2] 유저의 전체 주문 목록 확인
  async getOrdersByUser(userId) {

    const orders = await this.orderModel.findByUser(userId);

    if (orders.length < 1) {
      throw new Error('해당 사용자의 주문이 없습니다.');
    }

    /// ** db 목록에 있는 user_id로 user 정보를 가져와서 주문정보와 연결 **
    let returnOrders = [];
    for(let i = 0; i < orders.length; i++){

      // const order_user_id = orders[i].user_id.valueOf();
      // let user = await this.userModel.findById(order_user_id);

      // const {
      //   fullName,
      //   phoneNumber,
      //   email } = user;
    
      // const userInfo = {
      //   fullName,
      //   phoneNumber,
      //   email
      // }
      // // *** 유저정보 가공 끝 ******

      // /// ** orderedProducts의 정보로 제품 정보 가공 **
      // let productInfo = [];
      // const orderedProducts = orders[i].products;

      // for(let i = 0; i < orderedProducts.length; i++) {
      //   const order_product_id = orderedProducts[i].product_id.valueOf();
      //   const orderQty = orderedProducts[i].qty

      //   // product_id로 product 정보를 가져와서 주문정보 array에 담음
      //   const product = await this.productModel.findById(order_product_id);

      //   const {
      //     name,
      //     price
      //   } = product;
      
      //   const modifiedProduct = {
      //     name,
      //     price,
      //     qty: orderQty,
      //     totalPrice: price * orderQty
      //   }

      //   productInfo.push(modifiedProduct)
      // }
      // ***** 제품 가공 끝 *****************

      //// ******* cs status & order status 이름 반환 작업
      ///// order status id로 이름 반환
      const order_orderStatus_id = orders[i].orderStatus.valueOf();
      const orderStatus = await this.orderStatusModel.findById(order_orderStatus_id);

      if (!orderStatus) {
        throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
      }

      const orderStatusName = orderStatus.name;

      ///// cs status id로 이름 반환
      const order_csStatus_id = orders[i].csStatus.valueOf();
      const csStatus = await this.csStatusModel.findById(order_csStatus_id);

      if (!csStatus) {
        throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
      }

      const csStatusName = csStatus.name;

      const statusInfo = {
        orderStatus: orderStatusName,
        csStatus: csStatusName
      };
      ///////****** status 가공 끝 */

      const returnOrder = {
        orderInfo: orders[i],
        statusInfo
      };

      /// 가공된 데이터 반환
      returnOrders.push(returnOrder);
    }

    return returnOrders;
  }

  // [3] 주문 상세정보 확인
  async getOrder(orderId) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new Error('해당 주문 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    //// ******* cs status & order status 이름 반환 작업
    ///// order status id로 이름 반환
    const order_orderStatus_id = order.orderStatus.valueOf();
    const orderStatus = await this.orderStatusModel.findById(order_orderStatus_id);

    if (!orderStatus) {
      throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const orderStatusName = orderStatus.name;

    ///// cs status id로 이름 반환
    const order_csStatus_id = order.csStatus.valueOf();
    const csStatus = await this.csStatusModel.findById(order_csStatus_id);

    if (!csStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const csStatusName = csStatus.name;

    const statusInfo = {
      orderStatus: orderStatusName,
      csStatus: csStatusName
    };
    ///////****** status 가공 끝 */

    /// 유저, 주문, 제품 정보 담아서 return
    const returnOrder = {
      orderInfo: order,
      statusInfo
    };

    return returnOrder;
  }

  // [4] 주문 추가
  async addOrder(orderInfo) {

    let {
      user,
      fullNameTo,
      phoneNumberTo,
      addressTo,
      messageTo,
      products
    } = orderInfo;

    let productInfo = [];
    for(let i = 0; i < products.length; i++) {
      const product_id = products[i].product_id
      const qty = products[i].qty
      const price = products[i].price
      const totalPrice = products[i].totalPrice

      /// db의 재고 수정 *****
      let productForStock = await this.productModel.findById(product_id);

      const { stock } = productForStock;
      const numQty = Number(qty);
      const newStock = stock - numQty;
      const toUpdate = {
        stock: newStock
      };
      
      productForStock = await this.productModel.update({
        productId: product_id,
        update: toUpdate,
      });
      ///// 재고수정 끝 *****

      // product_id로 product 정보를 가져와서 주문정보 array에 담음
      const product = await this.productModel.findById(product_id);

      const { name } = product;
    
      const modifiedProduct = {
        product_id,
        name,
        price: price,
        qty: qty,
        totalPrice: totalPrice
      }
      
      productInfo.push(modifiedProduct)
    }

    const neworderInfo = {
      user,
      fullNameTo,
      phoneNumberTo,
      addressTo,
      messageTo,
      products: productInfo 
    };
    
    // db에 주문 정보 저장
    const newOrder = await this.orderModel.create(neworderInfo);

    //// ******* cs status & order status 이름 반환 작업
    ///// order status id로 이름 반환
    const order_orderStatus_id = newOrder.orderStatus.valueOf();
    const orderStatus = await this.orderStatusModel.findById(order_orderStatus_id);

    if (!orderStatus) {
      throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const orderStatusName = orderStatus.name;

    ///// cs status id로 이름 반환
    const order_csStatus_id = newOrder.csStatus.valueOf();
    const csStatus = await this.csStatusModel.findById(order_csStatus_id);

    if (!csStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const csStatusName = csStatus.name;

    const statusInfo = {
      orderStatus: orderStatusName,
      csStatus: csStatusName
    };
    ///////****** status 가공 끝 */

    /// 유저, 주문, 제품 정보 담아서 return
    const returnOrder = {
      orderInfo: newOrder,
      statusInfo
    };
    
    return returnOrder;
  }



  //// [5] 주문 정보 수정
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

    //// ******* cs status & order status 이름 반환 작업
    ///// order status id로 이름 반환
    const order_orderStatus_id = order.orderStatus.valueOf();
    const orderStatus = await this.orderStatusModel.findById(order_orderStatus_id);

    if (!orderStatus) {
      throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const orderStatusName = orderStatus.name;

    ///// cs status id로 이름 반환
    const order_csStatus_id = order.csStatus.valueOf();
    const csStatus = await this.csStatusModel.findById(order_csStatus_id);

    if (!csStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const csStatusName = csStatus.name;

    const statusInfo = {
      orderStatus: orderStatusName,
      csStatus: csStatusName
    };
    ///////****** status 가공 끝 */

    /// orderedProducts의 정보로 제품 정보 가공
    const orderedProducts = order.products;
    // let productInfo = [];
    for(let i = 0; i < orderedProducts.length; i++) {
      const order_product_id = orderedProducts[i].product_id.valueOf();
      const orderQty = orderedProducts[i].qty

      /// 만약 orderStatus가 취소/교환/반품 완료일 경우 db에 재고 돌려놈
      if (orderStatusName === ("취소완료" || "교환완료" || "반품완료")) {
        const modifyQty = -Math.abs(orderQty);
        let productForStock = await this.productModel.findById(order_product_id);

        const { stock } = productForStock;
        const newStock = stock - modifyQty;
        const toUpdate = {
          stock: newStock
        };
        
        productForStock = await this.productModel.update({
          productId: order_product_id,
          update: toUpdate,
        });
      };
    };
  
    /// 유저, 주문, 제품 정보 담아서 return
    const returnOrder = {
      orderInfo: order,
      statusInfo
    };
    return returnOrder;
  };

  /// [6] order id로 검색하여 orderStatus id, name 찾기
  async getCurrentOrderStatus(orderId) {
    let order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new Error('해당 주문 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const order_orderStatus_id = order.orderStatus.valueOf();
    const orderStatus = await this.orderStatusModel.findById(order_orderStatus_id);

    if (!orderStatus) {
      throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const orderStatusName = orderStatus.name;

    const orderStatusinfo = {
      id: order_orderStatus_id,
      name: orderStatusName
    }
    return orderStatusinfo;
  }


  /// [7] order id로 검색하여 csStatus orderStatus id, name 찾기
  async getCurrentCsStatus(orderId) {
    let order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new Error('해당 주문 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const order_csStatus_id = order.csStatus.valueOf();
    const csStatus = await this.csStatusModel.findById(order_csStatus_id);

    if (!csStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    const csStatusName = csStatus.name;


    const csStatusinfo = {
      id: order_csStatus_id,
      name: csStatusName
    }
    return csStatusinfo;
    }

  //// [8] 특정 주문의 userId 반환
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
  userModel,
  productModel,
  csStatusModel,
  orderStatusModel
);

export { orderService };
