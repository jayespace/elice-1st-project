/**
 * @todo
 *
 *
 */

import * as Api from '../api.js';
import { addCommas } from '/useful-functions.js';

const categoryNav = document.querySelector('.category');
const moreImage = document.getElementById('moreImage');
const list = document.querySelector('.product-list');
globalThis.page = 1;
globalThis.perPage = 8;
const queryCategory = new URLSearchParams(location.search).get('category');
console.log(queryCategory);
//initial Create Products
getDataFromApi(queryCategory, globalThis.page++, globalThis.perPage);

//infinity Scroll Function of Product Pagination
//catch ScrollEvent
const onScroll = (e) => {
  const { scrollHeight, scrollTop, clientHeight } = e.target.scrollingElement;
  if (
    scrollHeight === scrollTop + clientHeight &&
    globalThis.page <= globalThis.totalPage
  ) {
    getDataFromApi(queryCategory, globalThis.page++, globalThis.perPage);
  }
};
//prevent repeating Call Function
const debounce = (func, delay) => {
  let timeoutId = null;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func.bind(null, ...args), delay);
  };
};

document.addEventListener('scroll', debounce(onScroll, 150));

function setMoreImage(page, totalPage) {
  if (page > totalPage) {
    moreImage.classList.add('is-hidden');
  } else {
    moreImage.classList.remove('is-hidden');
  }
}

async function getDataFromApi(category, page, perPage) {
  console.log('category', category);
  const query =
    (category ? `category='${category}'` : '') +
    `&page=${page}&perPage=${perPage}`;
  try {
    const data = await Api.get(`/api/products?${query}`);
    console.log(data);
    const { totalPage, products } = data;
    globalThis.totalPage = totalPage;
    setMoreImage(globalThis.page, totalPage);
    products.map(insertHTMLToList);
  } catch (e) {
    console.error('페이지네이션 관련:', e);
  }
}

function insertHTMLToList(product) {
  const { _id, image, name, price } = product;
  list.insertAdjacentHTML(
    'beforeend',
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
  id.addEventListener('click', redirectProductDetail);
}

if (queryCategory !== null) {
  categoryNav.insertAdjacentHTML(
    'beforeend',
    `<li><a>${queryCategory}</a></li>`
  );
}
