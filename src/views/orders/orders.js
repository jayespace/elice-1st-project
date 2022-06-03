import {checkToken} from '/permission.js';
checkToken();
import * as Api from "../api.js";
import { addCommas } from "/useful-functions.js";
const ordersTop = document.querySelector(".orders-top");
getDataFromApi();
let data;
globalThis.i = 0;
async function getDataFromApi() {
  data = await Api.get("/api/orders");
  console.log(data);
  insertHTMLToList(data, data.length);
}

function getDataFromProducts(products) {
  let name = "";
  let price = 0;
  let shipFee = 3000;
  let totalFee = price + shipFee;
  let info = "";

  for (let i = 0; i < products.length; i++) {
    if (i === products.length - 1) {
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

  totalFee = price + shipFee;

  return { name, price, shipFee, totalFee, info };
}

function insertHTMLToList(orderList, length) {
  for (let i = 0; i < length; i++) {
    const { orderInfo, statusInfo } = orderList[i];
    const { createdAt, products } = orderInfo;
    const { name, totalFee } = getDataFromProducts(products);
    const date = createdAt.split("T")[0];
    const time = createdAt.split("T")[1].split(".")[0];

    ordersTop.insertAdjacentHTML(
      "afterend",
      `
        <div class="box colums orders-item">
          <div class="date">${date} ${time}</div>
          <div class="info">${name}</div>
          <div class="price">총 ${addCommas(totalFee)}원</div>
          <div class="status">${statusInfo.orderStatus}<br>${statusInfo.csStatus}</div>
          <div class="buttons">
            <button class="order-detail detailBtn"  data-columns=${i}>주문상세</button>
            <button class="order-cancle cancleBtn"  data-columns=${i}>주문취소</button>
          </div>
        </div>
      `
    );
    const detailBtn = document.querySelectorAll(".detailBtn"); //주문상세 버튼
    detailBtn.forEach(e => e.addEventListener("click", (e) => {
      e.preventDefault();
      showDetailModal(e.target.dataset.columns); //주문상세 모달 띄움
    }));

    const cancleBtn = document.querySelectorAll(".cancleBtn"); //주문취소 버튼
    cancleBtn.forEach(e => e.addEventListener("click", (e) => {
      e.preventDefault();
      globalThis.columns = e.target.dataset.columns;
      showCancleModal(); //주문취소 모달 띄움
    }));
  }

}

//주문취소 모달 -> 주문취소 취소 -> Modal닫음

function showCancleModal() {
  document.querySelector(".modal").style.display = "block";
  document.querySelector(".modal-background").style.display = "block";
}

const delCompleteBtn = document.getElementById("deleteCompleteButton");
delCompleteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  deleteOrder(globalThis.columns);
});

const delCancelBtn = document.getElementById("deleteCancelButton");
delCancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeCancleModal();
});

//주문취소 함수
async function deleteOrder(colNum) {
  console.log("데이터");
  console.log(data);
  console.log(data[colNum].statusInfo);
  const id = data[colNum].orderInfo._id;
  const formData = {
    csStatus: "취소",
  };
  try {
    await Api.patch("/api/orders", id, formData);
  } catch (e) {
    console.error(e);
    alert("주문 취소요청이 접수 됐습니다. 관리자에게 상태 변경을 요청하세요.");
  }
  closeCancleModal();
}

//주문취소Modal 닫음
function closeCancleModal() {
  document.querySelector(".modal").style.display = "none";
  document.querySelector(".modal-background").style.display = "none";
  location.reload();
}

//상세정보Modal
function showDetailModal(colNum) {
  console.log(data[colNum]);
  document.querySelector(".detail-modal").style.display = "block";
  document.querySelector(".modal-background").style.display = "block";

  const content = document.querySelector(".detail-modal");
  const { orderInfo } = data[colNum];
  const { addressTo, fullNameTo, messageTo, phoneNumberTo } = orderInfo;
  const { products, user } = orderInfo;
  const { email, fullName } = user;
  const { name, price, shipFee, totalFee, info } =
    getDataFromProducts(products);
  content.insertAdjacentHTML(
    "afterbegin",
    `
      <div id="detailModal" class="detail-modal">
        <div class="modal-background" id="modalBackground"></div>
          <div class="detail-modal-content">
            <div class="detail-box">
              <div class="product-info">
                <h1> 주문번호  ${orderInfo._id}</h1>
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
                  <p class="value">${addressTo.address1}<br>${
      addressTo.address2
    }</p>
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
    `
  );

  const closeDetailBtn = document.getElementById("closeDetailModal");
  closeDetailBtn.addEventListener("click", closeDetailModal);
}

function closeDetailModal() {
  document.querySelector(".detail-modal").style.display = "none";
  document.querySelector(".modal-background").style.display = "none";
  location.reload();
}
