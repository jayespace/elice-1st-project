import * as Api from '../api.js';

const url = new URL(window.location.href);
const id = url.searchParams.get("id");
const detail = document.querySelector(".product-detail");
const addBtn = document.querySelector('.add-button');
const purchaseBtn = document.querySelector('.purchase-button');
const minusBtn = document.getElementById("minus");
const plusBtn = document.getElementById("plus");
const total = document.querySelector(".total");
const qty = document.getElementById("qty");

let product = new Array(); //상품정보

addAllElements();
addAllEvents();
getDataFromApi();

async function getDataFromApi() {
  const data = await Api.get('/api/products');
  const arr = data.products;
  product = arr.find(a => a._id === id);

  insertHTMLToDetail(product);
  insertValue();
}

async function addAllElements() {
  
}
function addAllEvents() {
  addBtn.addEventListener("click", addToCart);
  purchaseBtn.addEventListener("click",purchaseProduct);
  minusBtn.addEventListener("click",minusQty);
  plusBtn.addEventListener("click",plusQty);
}

/**************여기 밑에 함수(function)을 입력해주세요***************/
function insertHTMLToDetail(product) {
  detail.insertAdjacentHTML(
    'afterbegin',
    `
    <div class="product-image">
        <img id="productImageTag" src="${product.image}" alt="상품이미지" />
    </div>
    `
  );
}

function insertValue(){
  const name = document.querySelector(".name");
  const price = document.querySelector(".price");
  const briefDesc = document.querySelector(".briefDesc");
  const fullDesc = document.querySelector(".fullDesc");
  
  name.innerText = product.name;
  price.innerText = (product.price).toLocaleString('en') + " 원";
  briefDesc.innerText = product.briefDesc;
  fullDesc.innerText = product.fullDesc;
  total.innerText = (product.price).toLocaleString('en') + " 원";
}

function addToCart() {
  product.count = Number(qty.innerText); //상품 수량 추가
  product.cart = 'checked';

  let getItem = JSON.parse(window.localStorage.getItem("cart"));
  let objectId = product._id;


  if(getItem === null) { //localstorage에 아무것도 없을 때
    getItem = [];
  }
  if (!getItem instanceof Array) {
    getItem = [getItem];
  }
  
  getItem = getItem.filter(function(a){
    if(a._id === objectId) alert('이미 장바구니에 담겨있어요!');
    return a._id !== objectId;
  });

  getItem.push(product);

  window.localStorage.setItem("cart", JSON.stringify(getItem));

  console.log(getItem);
}

function purchaseProduct() {
  window.location.href='../shippingpoint/shippingpoint.html';
}

function minusQty() {
  let num = Number(qty.innerText);
  if(num > 1){
    num -=1;
  }
  qty.innerText = num;
  total.innerText = (product.price*num).toLocaleString('en') + " 원";
}
function plusQty() {
  let num = Number(qty.innerText);
    if(num < product.stock)
      num +=1;
    else alert('재고가 더 없어요(T_T)');

    qty.innerText = num;
    total.innerText = (product.price*num).toLocaleString('en') + " 원";
}
