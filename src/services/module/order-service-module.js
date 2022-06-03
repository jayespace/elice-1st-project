import { orderModel, userModel, productModel, csStatusModel, orderStatusModel } from '../../db';

class OrderServiceModule {

  constructor(orderModel, userModel, productModel, csStatusModel, orderStatusModel) {
    this.orderModel = orderModel;
    this.userModel = userModel;
    this.productModel = productModel;
    this.csStatusModel = csStatusModel;
    this.orderStatusModel = orderStatusModel;
  }

  async getUserInfo(userId) {

    let user = await this.userModel.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const {
      fullName,
      phoneNumber,
      email } = user;
  
    const userInfo = {
      fullName,
      phoneNumber,
      email
    }
    
    return userInfo;
  }

  //// cs status & order status 이름 반환 작업
  async getStatusInfo(orderStatusId, csStatusId) {

    const orderStatus = await this.orderStatusModel.findById(orderStatusId);

    if (!orderStatus) {
      throw new Error('해당 order Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const orderStatusName = orderStatus.name;

    ///// cs status id로 이름 반환

    const csStatus = await this.csStatusModel.findById(csStatusId);

    if (!csStatus) {
      throw new Error('해당 CS Status 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const csStatusName = csStatus.name;

    const statusInfo = {
      orderStatus: orderStatusName,
      csStatus: csStatusName
    };

    return statusInfo;
  }

  /// orderedProducts의 정보로 제품 정보 가공
  async getProductInfo(orderedProducts) {

    let productInfo = [];
    for(let i = 0; i < orderedProducts.length; i++) {
      const order_product_id = orderedProducts[i].product_id.valueOf();
      const orderQty = orderedProducts[i].qty

      // product_id로 product 정보를 가져와서 주문정보 array에 담음
      const product = await this.productModel.findById(order_product_id);

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

        return productInfo;
  }

  /// orderedProducts의 정보로 제품 정보 가공
  async modifyProductStock(orderedProducts) {

    let productInfo = [];
    for(let i = 0; i < orderedProducts.length; i++) {
      const product_id = orderedProducts[i].product_id
      const orderQty = orderedProducts[i].qty

      /// db의 재고 수정 *****
      let productForStock = await this.productModel.findById(product_id);

      const { stock } = productForStock;
      const orderQtyNum = Number(orderQty);
      const newStock = stock - orderQtyNum;

      const toUpdate = {
        stock: newStock
      };
      
      productForStock = await this.productModel.update({
        productId: product_id,
        update: toUpdate,
      });
      productInfo.push(productForStock)
    }
    return productInfo;
  }

}

const orderServiceModule = new OrderServiceModule(
  orderModel,
  userModel,
  productModel,
  csStatusModel, 
  orderStatusModel
);

export { orderServiceModule };