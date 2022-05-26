import * as Api from "../api.js";

const productNameInput = document.querySelector("#productNameInput");
const productTextInput = document.querySelector("#productTextInput");

const imageInput = document.querySelector("#imageInput");
const addNewProductButton = document.querySelector("#addNewProductButton");
const image = document.querySelector("#product-image");

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
      const uploadedImage = resizeImage(data.target.result, 480, 480);
      console.log(image);
      image.src = uploadedImage;
      imagedata = uploadedImage;
    };
    //readAsDataURL 데이터를 읽습니다. 그리고 fileReader.onload가 진행됩니다.
    fileReader.readAsDataURL(input.files[0]);
  }
}

function resizeImage(img, MAX_WIDTH, MAX_HEIGHT) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  //캔버스에 업로드된 이미지를 그립니다.
  ctx.drawImage(img, 0, 0);

  const img_width = img.width;
  const img_height = img.height;

  if (width > height) {
    if (width > MAX_WIDTH) {
      height *= MAX_WIDTH / width;
      width = MAX_WIDTH;
    }
  } else {
    if (height > MAX_HEIGHT) {
      width *= MAX_HEIGHT / height;
      height = MAX_HEIGHT;
    }
  }
  canvas.width = width;
  canvas.height = height;
  // canvas에 변경된 크기의 이미지를 다시 그려줍니다.
  ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img_width, img_height);
  // canvas 에 있는 이미지를 img 태그로 넣어줍니다
  const dataUrl = canvas.toDataURL("image/png");
  return dataUrl;
}

async function addAllElements() {}

function addAllEvents() {
  imageInput.addEventListener("change", insertImageFile);
  addNewProductButton.addEventListener("click", handlePatch);
}

//회원정보 수정 진행
async function handlePatch(e) {
  e.preventDefault();

  const productName = productNameInput.value;
  const productText = productTextInput.value;

  // try{
  //     const data = { fullName, email, password };
  //     await Api.post('/api/register', data);
  // }catch (err) {
  //   console.error(err.stack);
  //   alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  // }
  //   alert(productName+" "+productText+" "+imagedata);
}
