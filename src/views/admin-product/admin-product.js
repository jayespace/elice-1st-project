import {checkAdmin} from '/permission.js';
checkAdmin();

import * as Api from "/api.js";
const productTable = document.getElementById("category-table");
const clearfix = document.getElementById("clearfix");
const mdEditBtn = document.getElementById('mdEditBtn');
const mdDelBtn = document.getElementById('mdDelBtn');
const perPage = 10; //한번 호출 마다 불러지는 데이터 

addAllElements();
addAllEvents();

async function addAllElements() {
  createProductsPage(1, perPage);
}

async function addAllEvents() {
  mdEditBtn.addEventListener('click', updateProductInfo);
  mdDelBtn.addEventListener('click', deleteProductInfo);
}


/**
 * Author : Park Award
 * create At : 22-06-04
 * @param {event} e
 * Update 관련 Modal 의 Submit 이벤트 처리 함수 입니다.
 */

async function updateProductInfo(e) {
  e.preventDefault();
  const id = globalThis.userId;
  console.log(id);
  redirectUrl('sellproduct',`id=${id}`);
}

/**
 * Author : Park Award
 * create At : 22-06-04
 * @param {event} e
 * delete 관련 Modal 의 Submit 이벤트 처리 함수 입니다.
 */

async function deleteProductInfo(e) {
  const id = globalThis.userId;
  try{
    const result = await Api.delete('/api/products',id);
    if(result){
      alert('성공적으로 삭제됨.');
    }
  }catch(e){
    console.error(e);
  }
}

/**
 * Author : Park Award
 * create At : 22-06-04
 * @param {Number} page 요청 페이지
 * @param {Number} perPage 페이지당 보여지는 데이터
 * Product Api에서 데이터를 불러와 
 * ProductsPage의 모든Element를 호출하는 함수 입니다.
 */

async function createProductsPage(page, perPage) {
  const query = `?page=${page}&perPage=${perPage}`
  try{  
  const data = await Api.get("/api/products",query);
  console.log(data);
  const { page, perPage, totalPage, totalProducts, products } = data;

  createProductsToTable(products);
  createPaginationMenu(perPage, totalProducts, totalPage, page);
  }catch(e){
    console.error(e)
  }
}

/**
 * Author : Park Award
 * create At : 22-06-04
 * update At : 22-06-05
 * @param {Object} products Product Api의 product Object 값 입니다.
 * productTable의 현재 상품목록을 생성합니다.
 */
async function createProductsToTable(products) {
  productTable.innerHTML = "";
  products.forEach(product => {
    productTable.appendChild(createProductsRow(product));
  });
}

/**
 * Author : Park Award
 * create At : 22-06-05
 * @param {Object} ProductData 
 * @returns {Element}
 * createProductsToTable 에 사용될 tr을 생성하는 함수입니다.
 *
 */
function createProductsRow(ProductData) {
  const { 
    _id,
    name,
    price,
    category,
    briefDesc,
    fullDesc,
    manufacturer,
    stock,
    keyword,
    image } = ProductData;
    const newNode = document.createElement('tr');
    newNode.innerHTML = 
          `
          <td class="tb_image"><div><img src='${image}'></div></td>
          <td class="tb_name">${name}</td>
          <td class="tb_price">${price}</td>
          <td class="tb_category">${category}</td>
          <td class="tb_briefDesc"><div>${briefDesc}</div></td>
          <td class="tb_fullDesc"><div>${fullDesc}</div></td>
          <td class="tb_manufacturer">${manufacturer}</td>
          <td class="tb_stock">${stock}</td>
          <td class="tb_keyword">${keyword}</td>
          `
    const newButtonNode = document.createElement('td');
    newButtonNode.innerHTML = 
          `
              <a href="#editProductModal" class="td_edit" data-toggle="modal" data-id="${_id}">
                  <i class="material-icons"data-id="${_id}">&#xE254;</i>
              </a>
              <a href="#deleteCategoryModal" class="td_delete" data-toggle="modal" data-id="${_id}">
                  <i class="material-icons" data-id="${_id}">&#xE872;</i>
              </a>
          </td>
          `
    const aTags = newButtonNode.getElementsByTagName('a');
    for(let a of aTags)a.addEventListener('click', e => globalThis.userId = e.target.dataset.id)
    newNode.appendChild(newButtonNode);
    return newNode;
  }


/**
 * Author : Park Award
 * Create At: 22-06-05
 * @param {Number} perPage 
 * @param {Number} totalPRoducts 
 * @param {Number} totalPage 
 * @param {Number} nowPage 
 * 
 *  Product Api의 데이터를 넣어 Pagination Menu를 생성합니다.
 */
function createPaginationMenu(perPage, totalPRoducts, totalPage, nowPage) {
  function createPaginationItems(num, active) {
    return `<li class="page-item${active ? " active" : ""} num-item" data-page=${num}>
              <a>${num}</a>
            </li>`;
  }
  clearfix.innerHTML = `
  <div class="clearfix">
  <div class="hint-text">Showing
      <b>${perPage}</b>
      out of
      <b>${totalPRoducts}</b>
      entries</div>
  <ul class="pagination">
      <li class="page-item disabled" id='previous'>
          <a>Previous</a>
      </li>
    ${nowPage - 2 > 0 ? createPaginationItems(nowPage - 2, false) : ""}
    ${nowPage - 1 > 0 ? createPaginationItems(nowPage - 1, false) : ""}
     ${createPaginationItems(nowPage, true)}
     ${
       nowPage + 1 <= totalPage ? createPaginationItems(nowPage + 1, false) : ""
     }
     ${
       nowPage + 2 <= totalPage ? createPaginationItems(nowPage + 2, false) : ""
     }

      <li class="page-item" id='next'>
          <a class="page-link">Next</a>
      </li>
  </ul>
</div>
  `;
  clearfix.querySelectorAll('.num-item:not(.active)').forEach(e =>{
    const {page} = e.dataset;
    e.addEventListener('click', () =>{
      createProductsPage(parseInt(page), perPage);
    })
  })

  clearfix.querySelector('#previous').addEventListener('click', ()=>{
    if(nowPage>1){
      createProductsPage(nowPage-1, perPage);
    }
    else{
      alert('첫 페이지 입니다.');
    }
  })
  clearfix.querySelector('#next').addEventListener('click', ()=>{
    if(nowPage<totalPage){
      createProductsPage(nowPage+1, perPage);
    }
    else{
      alert('마지막 페이지 입니다.');
    }
  })
}
