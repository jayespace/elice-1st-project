import * as Api from "/api.js";
import { randomId } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const category_table = document.getElementById("category-table");
const clearfix = document.getElementById("clearfix");
const mdEditBtn = document.getElementById('mdEditBtn');
const mdDelBtn = document.getElementById('mdDelBtn');
//ed-modal
const EditNameInput = document.getElementById("EditNameInput");

const perPage = 10;

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  createProductsPage(1, perPage);
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  mdEditBtn.addEventListener('click', updateUserInfo);
  mdDelBtn.addEventListener('click', deleteUserInfo);
  // EditSearchAddressButton.addEventListener('click',insertAddressInputsByDumPost);
  // EditSubmitButton.addEventListener('click', updateUserInfo);
}

async function updateUserInfo(e) {
  e.preventDefault();
  const id = globalThis.userId;
  console.log(id);
  redirectUrl('sellproduct',`id=${id}`);
}

async function deleteUserInfo(e) {
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



async function createProductsPage(page, perPage) {
  const query = `?page=${page}&perPage=${perPage}`
  try{  
  const data = await Api.get("/api/products",query);
  console.log(data);
  const { page, perPage, totalPage, totalProducts, products } = data;

  createProductsToTable(products);
  createClearFix(perPage, totalProducts, totalPage, page);
  }catch(e){
    console.error(e)
  }
}

async function createProductsToTable(products) {
  category_table.innerHTML = "";
  products.forEach(
    ({
      _id,
      name,
      price,
      category,
      briefDesc,
      fullDesc,
      manufacturer,
      stock,
      keyword,
      image,
    }) => {
      createProductsRow(
        _id,
        name,
        price,
        category,
        briefDesc,
        fullDesc,
        manufacturer,
        stock,
        keyword,
        image
      );
    }
  );
  function createProductsRow(
    _id,
    name,
    price,
    category,
    briefDesc,
    fullDesc,
    manufacturer,
    stock,
    keyword,
    image
  ) {
    category_table.insertAdjacentHTML(
      "beforeend",
      `
        <tr>
            <td class="tb_image"><div><img src='${image}'></div></td>
            <td class="tb_name">${name}</td>
            <td class="tb_price">${price}</td>
            <td class="tb_category">${category}</td>
            <td class="tb_briefDesc"><div>${briefDesc}</div></td>
            <td class="tb_fullDesc"><div>${fullDesc}</div></td>
            <td class="tb_manufacturer">${manufacturer}</td>
            <td class="tb_stock">${stock}</td>
            <td class="tb_keyword">${keyword}</td>
            <td>
                <a href="#editProductModal" class="td_edit" data-toggle="modal" data-id="${_id}">
                    <i class="material-icons"data-id="${_id}">&#xE254;</i>
                </a>
                <a href="#deleteCategoryModal" class="td_delete" data-toggle="modal" data-id="${_id}">
                    <i class="material-icons" data-id="${_id}">&#xE872;</i>
                </a>
            </td>
        </tr>
        `
    );
  }
  //bind ObejectID
  const edit = category_table.querySelectorAll('a');
  edit.forEach(e => e.addEventListener('click',  (e) => globalThis.userId = e.target.dataset.id));
}

function createClearFix(perPage, totalPRoducts, totalPage, nowPage) {
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
