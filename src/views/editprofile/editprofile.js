if(sessionStorage.length<1){
  alert('잘못된 접근입니다.');
  location.href = '/'
}

import * as Api from '/api.js';
import { randomId } from '/useful-functions.js';
import {modalExecution, DaumJibunAPI} from './profile-utils.js'

const fullNameInput = document.querySelector('#fullNameInput');
const passwordInput = document.querySelector('#password')
const passwordConfirmInput = document.querySelector('#passwordConfirm');
const postalCodeInput = document.querySelector('#postalCodeInput');
const address1Input = document.querySelector('#address1Input');
const address2Input = document.querySelector('#address2Input');
const phoneNumberInput = document.querySelector('#phoneNumberInput');

const imageInput = document.querySelector('#imageInput');
const searchAddressButton = document.querySelector("#searchAddressButton");
const saveButton = document.querySelector('#saveButton');

modalExecution();
addAllElements();
addAllEvents();


// 파일 업로드 함수 입니다.
function insertImageFile(file) {
  let input = file.target
  //이미지 파일 유효성 검사
if(input.files && input.files[0]) {
  const fileReader = new FileReader();
  fileReader.onload = function (data) {
          const img = document.querySelector('#profile-image');
          img.src = data.target.result;
          img.style.width = "100%"
          img.style.height = "100%"
  }
      //readAsDataURL 데이터를 읽습니다. 그리고 fileReader.onload가 진행됩니다.
  fileReader.readAsDataURL(input.files[0]); 

}
}

async function addAllElements(){
  setUserInfoToInputs();
}

function addAllEvents(){
  imageInput.addEventListener('change', insertImageFile);
  searchAddressButton.addEventListener('click',
    DaumJibunAPI(
        postalCodeInput, 
        address1Input, 
        address2Input
    ));
  saveButton.addEventListener('click', handlePatch);
  ;
}
//회원정보 셋팅
async function setUserInfoToInputs(){
  const userid = sessionStorage.userid;
  const data = await Api.get(`/api/users/${userid}`);
  fullNameInput.value = data.fullName;

}
//회원정보 수정 진행
async function handlePatch(e){
  e.preventDefault();

  const fullName = fullNameInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  const postalCode = postalCodeInput.value
  const address1 = address1Input.value;
  const address2 = address2Input.value;
  const phoneNumber = phoneNumberInput.value;
  // const image = imageInput.value;

  const isFullNameValid = fullName.length >= 2;
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;


}
