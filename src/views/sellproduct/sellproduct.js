import * as Api from "/api.js";
import { randomId, insertImageFile } from "/useful-functions.js";
import {checkAdmin} from '/permission.js';
checkAdmin();

const categorySelectBox = document.getElementById("categorySelectBox");
const productNameInput = document.getElementById("productNameInput");
const inventoryInput = document.getElementById("inventoryInput");
const priceInput = document.getElementById("priceInput");
const manufacturerInput = document.getElementById("manufacturerInput");
const shortDescriptionInput = document.getElementById("shortDescriptionInput");
const detailDescriptionInput = document.getElementById("detailDescriptionInput");
const addKeywordInput = document.getElementById("addKeywordInput");
const keywordContainer = document.getElementById("keywordContainer");
const addNewProductButton = document.getElementById("addNewProductButton");
const addKeywordButton = document.getElementById("addKeywordButton");
const imageInput = document.getElementById("productimageInput");
const imageProduct = document.getElementById("product-image");
let imagedata = "";

addAllElements();
addAllEvents();

async function addAllElements() {
  createCategoryToCategorySelectBox();
  insertProductInfo();
}

function addAllEvents() {
  imageInput.addEventListener("change", changeImageFile);
  addNewProductButton.addEventListener("click", handlePatch);
  addKeywordButton.addEventListener("click", inputKeywordTag);
  addKeywordInput.addEventListener("keypress", (e) =>
    e.key === "Enter" ? inputKeywordTag() : ""
  );
}

/**
 * Author : Park Award
 * create At 22-06-04
 * params의 id값을 조회해서 상품의 아이디값을 표기합니다.
 */
async function insertProductInfo(){
  if(location.search){
    const id = new URLSearchParams(location.search).get('id');
    globalThis.id = id;

    try{
      const {name, price, category, briefDesc, fullDesc, image, keyword, manufacturer, stock} = await Api.get('/api/products',id);
      globalThis.name = name;
      productNameInput.value = name;
      inventoryInput.value = stock;
      priceInput.value = price;
      manufacturerInput.value = manufacturer;
      categorySelectBox.value = category;
      shortDescriptionInput.value = briefDesc;
      detailDescriptionInput.value = fullDesc;
      imageProduct.src = image;
      imageProduct.style.width = "128px";
      imageProduct.style.height = "128px";
      keyword.map(addKeywordTag);
    }
    catch(e){
      console.error(e);
      alert('유효하지 않은 정보입니다.')
    }
}
}

/**
 * Author : Park Award
 * create At: 22-05-04
 * @param {Event} file 
 * 사용자가 올린 이미지를 보여주고, 변수에 저장하는 함수입니다.
 */
async function changeImageFile(file) {
  if (file.target.files[0]) {
    imagedata = file.target.files[0];
    try {
      const imgSrc = await insertImageFile(file.target.files[0]);
      imageProduct.src = imgSrc;
      imageProduct.style.width = "128px";
      imageProduct.style.height = "128px";
    } catch (e) {
      console.error("이미지 관련 오류", e.massage);
    }
  }
}

/**
 * Author : Park Award
 * create At: 22-05-04
 * 서버의 Category를 불러와 옵션에 추가합니다.
 */
async function createCategoryToCategorySelectBox() {
  try {
    const data = await Api.get("/api/categories");
    categorySelectBox.innerHTML =
      data.map(({ _id, name }) => 
      createCategoryItem(_id, name)).join("");

  } catch (e) {
    console.error(e.massage);
  }
}
/**
 * Author : Park Award
 * create At : 22-05-04
 * @param {String} value Object Id를 사용하지 않게 됨 
 * @param {String} nameCategory 
 * @returns {String}
 * SelectBox option태그 String을 반환합니다.
 */
function createCategoryItem(value, nameCategory) {
  return `
    <option value="${nameCategory}" class="notification is-primary is-light"> ${nameCategory} </option>
    `;
}

/**
 * Author : Park Award
 * create At : 22-05-04
 * 키워드 Input에 입력된 값을 태그 컨테이너에 띄웁니다.
 */
function inputKeywordTag(){
  const keyword = addKeywordInput.value;
  if (!keyword) return;
  addKeywordTag(keyword)
}

/**
 * Author : Park Award
 * create At: 22-05-04
 * @param {String} keyword
 * 값을 태그 컨테이너에 띄웁니다.
 */
function addKeywordTag(keyword) {
  const rand = randomId();
  addKeywordInput.value = "";
  keywordContainer.insertAdjacentHTML(
    "beforeend",
    `
    <div class="control" id="${rand}"
      <div class="tags has-addons">
        <span class="tag is-link is-light">${keyword}</span>
      <a class="tag is-link is-light is-delete"></a>
    </div>
    </div>
    `
  );
  const control = document.getElementById(rand);
  control.querySelector("a").addEventListener("click", () => control.remove());
}

/**
 * Author : Park Award
 * create At : 22-05-04
 * @param {Event} e 
 * @returns 
 * 수정된 데이터를 서버에 Patch를 통해 보냅니다.
 */
async function handlePatch(e) {
  e.preventDefault();

  const productName = productNameInput.value;
  const inventory = inventoryInput.value;
  const price = priceInput.value;
  const manufacturer = manufacturerInput.value;
  const shortDescription = shortDescriptionInput.value;
  const detailDescription = detailDescriptionInput.value;
  const categorySelect = categorySelectBox.value;
  const isProductNameValid = productName.length >= 1;
  const isInventoryValid = inventory > 0;
  const isPriceValid = price >= 100;
  const isManufacturerValid = (/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/).exec(manufacturer);

  if (!isProductNameValid) {
    return alert("제품 이름을 입력해주세요.");
  }
  if (!categorySelect) {
    return alert("카테고리를 선택해주세요.");
  }
  if (!isInventoryValid) {
    return alert("재고 수량은 1 개 이상입니다.");
  }
  if (!isPriceValid) {
    return alert("1000원 이상 입력해주세요.");
  }
  if (!isManufacturerValid) {
    return alert("제조사를 입력해주세요.");
  }
  if(!imagedata){
    return alert("이미지를 입력해주세요");
  }
  const keyword = document.querySelectorAll("span.tag");
  
  const formData = new FormData();
  if(!globalThis.id || productName !== globalThis.name){
    formData.append("name", productName);
  }
  formData.append("price", price);
  formData.append("category", categorySelect);
  formData.append("briefDesc", shortDescription);
  formData.append("fullDesc", detailDescription);
  formData.append("manufacturer", manufacturer);
  formData.append("stock", inventory);
  keyword.forEach((data) => formData.append("keyword", data.textContent));
  formData.append("image", imagedata);

  try {
    let result;
    if(!globalThis.id){
      result = await Api.postMulti("/api/products", formData);
    }else{
      result = await Api.patchMulti("/api/products", globalThis.id, formData);
    }
    if (result) {
      if(globalThis.id) redirectUrl('admin-product');
      else{alert("이미지가 업로드 됐습니다.");
      location.reload();}
    }
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

function redirectUrl(page, params) {
  page ?? '';
  const protocol = location.protocol;
  const host = location.hostname;
  const port = location.port
  console.log(page);
  location.href = `${protocol}//${host}:${port}/${page}${params?'?'+params:''}`
}