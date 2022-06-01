import * as Api from "../api.js";
import { addCommas } from "/useful-functions.js";
const list = document.querySelector(".product-list");

getDataFromApi();

async function getDataFromApi() {
  const data = await Api.get("/api/products");
  console.log(data);
  const arr = data.products;

  arr.map((product) => {
    insertHTMLToList(product);
  });
}

function insertHTMLToList(product) {
  const { _id, image, name, price } = product;
  list.insertAdjacentHTML(
    "beforeend",
    `
      <div class="product" id="${_id}">
        <div class="img">
          <img src="${image}" alt="상품이미지">
        </div>
        <div class="content">
          <h2 class="name" id="pname">${name}</h2>
          <p class="price" id="pprice">${addCommas(price)}원</p>
        </div>
      </div>
    `
  );

  const id = document.getElementById(_id);
  function redirectProductDetail(e) {
    const url = `/detail?id=${_id}`;
    console.log(url);
    location.href = url;
  }
  id.addEventListener("click", redirectProductDetail);
}
