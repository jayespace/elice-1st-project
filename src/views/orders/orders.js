import * as Api from "../api.js";
import { addCommas } from "/useful-functions.js";
const ordersTop = document.querySelector('.orders-top');

getDataFromApi();
let data;
// let name = '';
// let price = 0;
// let shipFee = 3000;
// let totalFee = price + shipFee;
// let a = '';
async function getDataFromApi() {
  data = await Api.get("/api/orders");

  insertHTMLToList(data, data.length);
}

function getDataFromProducts(products){
  let name = '';
  let price = 0;
  let shipFee = 3000;
  let totalFee = price + shipFee;
  let info = '';

  for (let i = 0; i < products.length; i++) {
    if (i === products.length-1) {
      name += products[i].name;
    } else {
      name += products[i].name + `<br><br>`;
    }

    price += products[i].totalPrice;

    info += `
    <div class="p-info">
      <img src="${products[i].image}"></img>
      <p class="pInfo">${products[i].name} <br><br> 총 ${products[i].qty}개</p>
    </div>
    `;
  }

  if (price >= 50000) {
    shipFee = 0;
  }
  totalFee = price + shipFee;

  return {name, price, shipFee, totalFee, info};
}

function insertHTMLToList(orderList, length) {
  for (let i = 0; i < length; i++) {
    const { orderInfo, statusInfo } = orderList[i];
    const { createdAt, products } = orderInfo;

    const date = createdAt.split("T")[0];
    const time = createdAt.split("T")[1].split(".")[0];
    const {name, totalFee} = getDataFromProducts(products);

    ordersTop.insertAdjacentHTML(
      "afterend",
      `
        <div class="box colums orders-item">
            <div class="date">${date} ${time}</div>
            <div class="info">${name}</div>
            <div class="price">총 ${totalFee.toLocaleString("en")}원</div>
            <div class="status">${statusInfo.orderStatus}</div>
            <div class="buttons">
              <button class="order-detail" id="detailBtn" data-columns=${i}>주문상세</button>
              <button class="order-cancle" id="cancleBtn" data-columns=${i}>주문취소</button>
            </div>
        </div>
      `
    );
    const detailBtn = document.getElementById("detailBtn");
    detailBtn.addEventListener("click", e => {
      e.preventDefault();
      showDetailModal(detailBtn.dataset.columns);
    });

    const cancleBtn = document.getElementById("cancleBtn");
    cancleBtn.addEventListener("click", e => {
      e.preventDefault();
      showCancleModal(cancleBtn.dataset.columns);
    });
  }
}

const delCancelBtn = document.getElementById('deleteCancelButton');
delCancelBtn.addEventListener("click", closeCancleModal);

const modalCloseBtn = document.getElementById('modalCloseButton');
modalCloseBtn.addEventListener("click", closeCancleModal);

function deleteOrder(colNum) { //주문취소
  const { statusInfo } = data[colNum];

  console.log(data[colNum]);
  statusInfo.orderStatus = "주문취소";
  alert('주문이 취소되었습니다');
  closeCancleModal();
  location.reload();
}

function showCancleModal(colNum) {
  document.querySelector('.modal').style.display = 'block';
  document.querySelector('.modal-background').style.display = 'block';

  const delCompleteBtn = document.getElementById('deleteCompleteButton');
  delCompleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deleteOrder(colNum)
  });
}

function closeCancleModal() {
  document.querySelector('.modal').style.display = 'none';
  document.querySelector('.modal-background').style.display = 'none';
}

function showDetailModal(colNum) {
  console.log(data[colNum]);
  document.querySelector('.detail-modal').style.display = 'block';
  document.querySelector('.modal-background').style.display = 'block';

  const content = document.querySelector('.detail-modal');
  const { orderInfo } = data[colNum];
  const { addressTo, fullNameTo, messageTo, phoneNumberTo } = orderInfo;
  const { products, user } = orderInfo;
  const { email, fullName } = user;
  const {name, price, shipFee, totalFee, info} = getDataFromProducts(products);
  content.insertAdjacentHTML("afterbegin",
    `
  <div id="detailModal" class="detail-modal">
  <div class="modal-background" id="modalBackground"></div>
  <div class="detail-modal-content">

        <div class="box">
          <div class="product-info">
            <h1>주문상품정보</h1>
            ${info}
          </div>

          <div class="user-info">
            <h1>구매자정보</h1>
            <span>
              <p class="label">주문자</p>
              <p class="value">${fullName}</p>
            </span>
            <span>
              <p class="label">이메일주소</p>
              <p class="value">${email}</p>
            </span>
          </div>

          <div class="address-info">
            <h1>배송지정보</h1>
            <span>
              <p class="label">받는사람</p>
              <p class="value">${fullNameTo}</p>
            </span>
            <span>
              <p class="label">휴대폰 번호</p>
              <p class="value">${phoneNumberTo}</p>
            </span>
            <span>
              <p class="label">주소</p>
              <p class="value">${addressTo.address1} ${addressTo.address2} </p>
            </span>
            <span>
              <p class="label">배송요청사항</p>
              <p class="value">${messageTo}</p>
            </span>
          </div>

          <div class="payment-info">
            <h1>결제정보</h1>
            <span>
              <p class="label">주문금액</p>
              <p class="value">${price.toLocaleString("en")}</p>
            </span>
            <span>
              <p class="label">배송비</p>
              <p class="value">${shipFee.toLocaleString("en")}</p>
            </span>
            <span>
              <p class="label">결제금액</p>
              <p class="value">${totalFee.toLocaleString("en")}</p>
            </span>
          </div>

          <div class="buttons">
            <button class="button is-primary mt-5" id="closeDetailModal" aria-label="closeDetailModal">
              닫기
            </button>
          </div>
        </div>
      </div>
      </div>
      </div>
  `)

  const closeDetailBtn = document.getElementById('closeDetailModal');
  closeDetailBtn.addEventListener("click", closeDetailModal);
}

function closeDetailModal() {
  document.querySelector('.detail-modal').style.display = 'none';
  document.querySelector('.modal-background').style.display = 'none';
  location.reload();
}