import * as Api from '../api.js';
import { addCommas } from '/useful-functions.js';

const list = document.querySelector('.product-list');

const queryCategory = new URLSearchParams(location.search).get('category');
globalThis.category = queryCategory;
globalThis.page = 1;
globalThis.perPage = 8;

addAllElements();
addAllEvents();

async function addAllElements() {
  setCategoryNav();
  await createProductsItems(globalThis.page, globalThis.category);
  observeLastChild(io);
}

function addAllEvents() {
}


/**
 * Author : gaeunn0724
 * created At: 22-06-03
 * Breadcrumb 를 표기합니니다.
 */

function setCategoryNav(){
  const categoryNav = document.querySelector('.category');
  if (queryCategory !== null) {
    categoryNav.insertAdjacentHTML(
      'beforeend',
      `<li><a>${queryCategory}</a></li>`
    );
  }
}

/**
 * Author : Park Award
 * created At : 22-06-06
 * @param {Number} page 
 * @param {String} category
 * product-list 들어갈 아이템들을 넣어줍니다. 
 */
async function createProductsItems(page, category) {
  const { products, totalPage } = await getProductsList(page, category);
  globalThis.totalPage = totalPage;
  const productTags = products.map(insertHTMLToList)
  // console.log(productTags);
  for (let tags of productTags)
    list.appendChild(tags);
}
/**
 * Author : Park Award
 * created At : 22-06-06 
 * @param {Number} page 
 * @param {String} category 
 * @returns {Object}
 * Api 로부터 데이터를 가져옵니다.
 * 그리고 그 데이터를 반환합니다.
 */

async function getProductsList(page, category) {
  try {
    const query = (category ? `?category='${category}'` : '?') +
      `&page=${page}&perPage=${globalThis.perPage}`
    const data = await Api.get("/api/products", query);
    return data;
  } catch (e) {
    console.error('데이터 호출 관련', e);
  }
}

/**
 * Author : Park Award
 * created At : 22-06-06
 * @param {Object} product 
 * @returns Element
 * product Data 를 elem으로 가공하여 반환합니다.
 */
function insertHTMLToList(product) {
  const { _id, image, name, price } = product;
  const newNode = document.createElement('div');
  newNode.id = _id;
  newNode.classList.add('product');
  newNode.innerHTML =
    `
  <div class="img">
    <img src="${image}" alt="상품이미지">
  </div>
  <div class="content">
    <h2 class="name" id="pname">${name}</h2>
    <p class="price" id="pprice">${addCommas(price)}원</p>
  </div>
  `
  newNode.addEventListener('click', redirectProductDetail);
  function redirectProductDetail() {
    const url = `/detail?id=${_id}`;
    location.href = url;
  }
  return newNode;
}


/**
 * Author : Park Award
 * created At : 22-06-06
 * @param {IntersectionObserver} intersectionObserver 
 * Product 의 마지막 elem을 관측합니다.
 * 마지막 이외의 elem의 관측을 취소합니다
 */
function observeLastChild(intersectionObserver) {
  const currentPage = globalThis.page;
  const lastPage = globalThis.totalPage;

  const listChildren = document.querySelectorAll(".product");
  console.log(currentPage, lastPage);
  listChildren.forEach(el => {
    if (!el.nextSibling && currentPage < lastPage) {
      intersectionObserver.observe(el) // el에 대하여 관측 시작
    } else if (currentPage >= lastPage) {
      intersectionObserver.disconnect()
      setMoreImage(currentPage, lastPage);
    }
  })
}

const observerOption = {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: 0.5
}

/**
 * Author : Park Award
 * created At : 22-06-06
 * IntersectionObserver 인스턴스 생성합니다.
 * observerOption을 통해 마지막 요소가 뷰포트와 50%(threshold 0.5) 교차되었으면
 * 다음 데이터를 가져옵니다.
 */
const io = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(async () => {
       await createProductsItems(++globalThis.page);
        observer.unobserve(entry.target);
        observeLastChild(observer);
      }, 1000)
    }
  })
}, observerOption)


/**
 * Author : Park Award
 * created At : 22-06-06
 * @param {Number} page 
 * @param {Number} totalPage
 * vertical ... 의 이미지를 보여줄지 결정합니다. 
 */
function setMoreImage(page, totalPage) {
  const moreImage = document.getElementById('moreImage');

  if (page >= totalPage) {
    moreImage.classList.add('is-hidden');
  } else {
    moreImage.classList.remove('is-hidden');
  }
}
