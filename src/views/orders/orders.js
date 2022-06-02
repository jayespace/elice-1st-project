import * as Api from "../api.js";
import { addCommas } from "/useful-functions.js";
const ordersTop = document.querySelector('.orders-top');

getDataFromApi();

async function getDataFromApi() {
  const data = await Api.get("/api/orders");

  console.log(data[0]);
  console.log(data.length);
  
  insertHTMLToList(data, data.length);
}

function insertHTMLToList(orderList,length) {
    for(let i=0; i<length; i++){
        const {orderInfo, productInfo, statusInfo, userInfo} = orderList[i];
        console.log(orderInfo.createdAt);
        const date = orderInfo.createdAt.split("T")[0];
        const time = orderInfo.createdAt.split("T")[1].split(".")[0];
    
        let name = '';
        let price = 0;
        let qty = 0;
        for(let i=0; i< productInfo.length; i++){
            console.log(productInfo[i].name);
            if(i === productInfo.length-1){
              name += productInfo[i].name;
            }else {
              name += productInfo[i].name + `<br><br>`;
            }
            
            price += productInfo[i].price;
            qty += productInfo[i].qty;
        }
        
      
        console.log(name);
        ordersTop.insertAdjacentHTML(
            "afterend",
            `
            <div class="box colums orders-item">
            <div class="date">${date} ${time}</div>
            <div class="info">${name}</div>
            <div class="qty">총 ${qty}개</div>
            <div class="price">총 ${price.toLocaleString("en")}원</div>
            <div class="status">${statusInfo.orderStatus}</div>
            <div class="buttons">
              <button class="order-detail">주문상세</button>
              <button class="order-cancle">주문취소</button>
            </div>
          </div>
            `
    )}

    const detailBtn = document.querySelector(".order-detail");
    detailBtn.addEventListener("click", showDetailModal);

    const cancleBtn = document.querySelector(".order-cancle");
    cancleBtn.addEventListener("click", showCancleModal);
}



const deleteCancelBtn = document.getElementById('deleteCancelButton');
deleteCancelBtn.addEventListener("click", closeCancleModal);


const modalCloseBtn = document.getElementById('modalCloseButton');
modalCloseBtn.addEventListener("click",closeCancleModal);

const closeDetailBtn = document.getElementById('closeDetailModal');
closeDetailBtn.addEventListener("click",closeDetailModal);



function showCancleModal(){
  document.querySelector('.modal').style.display = 'block';
  document.querySelector('.modal-background').style.display = 'block';
}

function closeCancleModal(){
  document.querySelector('.modal').style.display = 'none';
  document.querySelector('.modal-background').style.display = 'none';
}

function showDetailModal(){
  document.querySelector('.detail-modal').style.display = 'block';
  document.querySelector('.modal-background').style.display = 'block';
}

function closeDetailModal(){
  document.querySelector('.detail-modal').style.display = 'none';
  document.querySelector('.modal-background').style.display = 'none';
}