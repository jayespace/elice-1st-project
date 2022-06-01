import { orderModel } from '../../db';
import { userService } from '../category-service';
import { productService } from '../product-service';
import { csStatusService } from '../csStatus-service';
import { orderStatusService } from '../orderStatus-service';

class OrderServiceModule {

  constructor(orderModel, userService, productService, csStatusService, orderStatusService) {
    this.orderModel = orderModel;
    this.userService = userService;
    this.productService = productService;
    this.csStatusService = csStatusService;
    this.orderStatusService = orderStatusService;
  }

  async getUserInfo(order_user_id) {

    // const order_user_id = order.user_id.valueOf();
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

    return userInfo;
  }

  //// cs status & order status 이름 반환 작업
  async getStatusInfo(order_orderStatus_id, order_csStatus_id) {
    
    // const order_csStatus_id = order.orderStatus.valueOf();
    // const cs_csStatus_id = order.csStatus.valueOf();
    const orderStatusName = await this.orderStatusService.getOrderStatusName(order_orderStatus_id);
    const csStatusName = await this.csStatusService.getCsStatusName(order_csStatus_id);

    const statusInfo = {
      orderStatus: orderStatusName,
      csStatus: csStatusName
    };

    return statusInfo;
  }

  /// orderedProducts의 정보로 제품 정보 가공
  async getProductInfo(orderedProducts) {

        // const orderedProducts = order.products;
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

        return productInfo;
  }

}

const orderServiceModule = new OrderServiceModule(
  orderModel,
  userService,
  productService,
  csStatusService, 
  orderStatusService
);

export { orderServiceModule };