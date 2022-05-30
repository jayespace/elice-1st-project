import * as Api from "/api.js";
import { randomId } from "/useful-functions.js";

const categorySelectBox = document.getElementById("categorySelectBox");

const productNameInput = document.getElementById("productNameInput");
const inventoryInput = document.getElementById("inventoryInput");
const priceInput = document.getElementById("priceInput");
const manufacturerInput = document.getElementById("manufacturerInput");
const shortDescriptionInput = document.getElementById("shortDescriptionInput");
const detailDescriptionInput = document.getElementById(
  "detailDescriptionInput"
);
const addKeywordInput = document.getElementById("addKeywordInput");
const keywordContainer = document.getElementById("keywordContainer");

//버튼
const addNewProductButton = document.getElementById("addNewProductButton");
const addKeywordButton = document.getElementById("addKeywordButton");

// 이미지 관련 패턴
const imageInput = document.getElementById("productimageInput");
const image = document.getElementById("product-image");

let imagedata = "";

addAllElements();
addAllEvents();

// 파일 업로드 함수 입니다.
function insertImageFile(file) {
  let input = file.target;
  //이미지 파일 유효성 검사
  if (input.files && input.files[0]) {
    const fileReader = new FileReader();
    fileReader.onload = function (data) {
      const uploadedImage = data.target.result;
      console.log(image);
      image.src = uploadedImage;
      image.style.width = "128px";
      image.style.height = "128px";
    };
    //readAsDataURL 데이터를 읽습니다. 그리고 fileReader.onload가 진행됩니다.
    imagedata = input.files[0];
    fileReader.readAsDataURL(input.files[0]);
  }
}

async function addAllElements() {
  createCategoryToCategorySelectBox();
}

function addAllEvents() {
  imageInput.addEventListener("change", insertImageFile);
  addNewProductButton.addEventListener("click", handlePatch);
  addKeywordButton.addEventListener("click", addKeywordTag);
  addKeywordInput.addEventListener("keypress", (e) => e.key === 'Enter'? addKeywordTag() : '');
}
//카테고리 표시 기능
async function createCategoryToCategorySelectBox() {
  function createCategoryItem(value, nameCategory) {
    return `
      <option value="${nameCategory}" class="notification is-primary is-light"> ${nameCategory} </option>
      `;
  }
  try {
    const data = await Api.get("/api/categories");

    categorySelectBox.insertAdjacentHTML(
      "beforeend",
      data.map(({ _id, name }) => createCategoryItem(_id, name)).join(" ")
    );
  } catch (e) {
    console.error(e.massage);
  }
}
//
function addKeywordTag() {
  const keyword = addKeywordInput.value;
  if (!keyword) return;

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

//회원정보 수정 진행
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
  const isPriceValid = price >= 1000;
  const isManufacturerValid = manufacturer.length >= 1;
  const isShortDescriptionValid = shortDescription;

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
  if (!isShortDescriptionValid) {
    return alert("제품에 대한 1~2문장의 설명을 적어주세요.");
  }
  const keyword = document.querySelectorAll("span.tag");

  const formData = new FormData();
  formData.append("name", productName);
  formData.append("price", price);
  formData.append("category", categorySelect);
  formData.append("briefDesc", shortDescription);
  formData.append("fullDesc", detailDescription);
  formData.append("manufacturer", manufacturer);
  formData.append("stock", inventory);
  keyword.forEach((data) => formData.append("keyword", data.textContent));
  formData.append("image", imagedata);

  try {
    const result = await Api.postMulti("/api/products", formData);
    if (result) {
      alert("이미지가 업로드 됐습니다.");
      location.reload();
    }
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
