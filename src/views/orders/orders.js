import * as Api from "../api.js";
import { addCommas } from "/useful-functions.js";

getDataFromApi();

async function getDataFromApi() {
  const data = await Api.get("/api/orders");

  console.log(data);
  
}

// function insertHTMLToList(product) {
//   const { _id, image, name, price } = product;
//   list.insertAdjacentHTML(
//     "beforeend",
//     `
//       <div class="product" id="${_id}">
//         <div class="img">
//           <img src="${image}" alt="상품이미지">
//         </div>
//         <div class="content">
//           <h2 class="name" id="pname">${name}</h2>
//           <p class="price" id="pprice">${addCommas(price)}원</p>
//         </div>
//       </div>
//     `
//   );

//   const id = document.getElementById(_id);
//   function redirectProductDetail(e) {
//     const url = `/detail?id=${_id}`;
//     console.log(url);
//     location.href = url;
//   }
//   id.addEventListener("click", redirectProductDetail);
// }