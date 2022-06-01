import * as Api from '../api.js';

const list = document.querySelector(".product-list");

getDataFromApi();

async function getDataFromApi() {
  const data = await Api.get('/api/products');
  const arr = data.products;

  arr.map((product)=>{
      insertHTMLToList(product);
  });
}

/**************여기 밑에 함수(function)을 입력해주세요***************/
function insertHTMLToList(product) {
  let price = (product.price).toLocaleString('en');
  list.insertAdjacentHTML(
    'beforeend',
    `
      <div class="product" id="${product._id}">
        <div class="img">
          <img src="${product.image}" alt="상품이미지">
        </div>
        <div class="content">
          <h2 class="name" id="pname">${product.name}</h2>
          <p class="price" id="pprice">${price}원</p>
        </div>
      </div>
    `
  );

  let url;
  const id = document.getElementById(product._id);

  id.querySelector('div').addEventListener('click', (url = `/detail?id=${product._id}`,
    function () {
      window.location.href = url;
    }
  ))
}
