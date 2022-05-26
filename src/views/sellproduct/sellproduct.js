import * as Api from '/api.js';

const productNameInput = document.querySelector('#productNameInput');
const productTextInput = document.querySelector('#productTextInput')

const imageInput = document.querySelector('#imageInput');
const addNewProductButton = document.querySelector('#addNewProductButton');
const image = document.querySelector('#product-image');

let imagedata ='';

addAllElements();
addAllEvents();


// 파일 업로드 함수 입니다.
function insertImageFile(file) {

  let input = file.target;
  //이미지 파일 유효성 검사
if(input.files && input.files[0]) {
    const fileReader = new FileReader();
    fileReader.onload = function (data) {
            image.src = data.target.result;
            imagedata = data.target.result;
            image.style.width = "100%"
            image.style.height = "100%"
    }
      //readAsDataURL 데이터를 읽습니다. 그리고 fileReader.onload가 진행됩니다.
    fileReader.readAsDataURL(input.files[0]);
    
    }
}

async function addAllElements(){}

function addAllEvents(){
  imageInput.addEventListener('change', insertImageFile);
  addNewProductButton.addEventListener('click', handlePatch);;
}

//회원정보 수정 진행
async function handlePatch(e){
  e.preventDefault();

  const productName = productNameInput.value;
  const productText = productTextInput.value;
    
  try{
      const data = { fullName, email, password };
      await Api.post('/api/register', data);
  }catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
//   alert(productName+" "+productText+" "+imagedata);

}
