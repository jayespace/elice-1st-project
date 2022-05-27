if(sessionStorage.length<1){
  const e = window.location.pathname,
    t = window.location.search;
  window.location.replace(`/login?previouspage=${e + t}`);
}

import * as Api from '/api.js';
import { randomId } from '/useful-functions.js';
import {modalExecution, DaumJibunAPI} from './profile-utils.js'

const profileHeadLabel = document.querySelector('.profile-header h1');

const fullNameInput = document.querySelector('#fullNameInput');
const currentPasswordInput = document.querySelector('#currentPasswordInput');
const reenPasswordInput = document.querySelector('#reenPasswordInput')
const reenPasswordConfirmInput = document.querySelector('#reenPasswordConfirmInput');
const postalCodeInput = document.querySelector('#postalCodeInput');
const address1Input = document.querySelector('#address1Input');
const address2Input = document.querySelector('#address2Input');
const phoneNumberInput = document.querySelector('#phoneNumberInput');

const imageInput = document.querySelector('#imageInput');
const searchAddressButton = document.querySelector("#searchAddressButton");
const saveButton = document.querySelector('#saveButton');

let userInfoObject = {};


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
  console.log(data);
  const {fullName, email, password, postalCode, address1, address2, phoneNumber} = data;

  console.log(fullName, password, postalCode, address1, address2, phoneNumber);

  userInfoObject = {
    fullName,
    password, 
    postalCode, 
    address1, 
    address2, 
    phoneNumber
  };
  profileHeadLabel.insertAdjacentText('beforeend', `(${email})`);
  fullNameInput.value = fullName;
  postalCodeInput.value = postalCode ?? '';
  reenPasswordInput.value = '';
  address1Input.value = address1 ?? '';
  address2Input.value = address2 ?? '';
  phoneNumberInput.value = phoneNumber ?? '';

}
//회원정보 수정 진행
async function handlePatch(e){
  e.preventDefault();

  const fullName = fullNameInput.value;
  const currentPassword = currentPasswordInput.value;
  const reenPassword = reenPasswordInput.value;
  const reenPasswordConfirm = reenPasswordConfirmInput.value;
  const postalCode = postalCodeInput.value
  const address1 = address1Input.value;
  const address2 = address2Input.value;
  const phoneNumber = phoneNumberInput.value;
  // const image = imageInput.value;

  //세션 확실한 값
  const isFullNameValidModify = fullName === userInfoObject.fullName;
  const isReenPasswordValidModify = reenPassword.length < 1;
  const isReenPasswordSame = reenPassword === reenPasswordConfirm;

  //세션 불확실 값
  const isPostalCodeValidModify = postalCode === (userInfoObject.postalCode ?? '');
  const isAddress1CodeValidModify = address1 === (userInfoObject.address2Code ?? '');
  const isAddress2CodeValidModify = address2 === (userInfoObject.address2Code ?? '');
  const isPhoneNumberValidModify = phoneNumber === (userInfoObject.phoneNumber ?? '');



  if(!isReenPasswordSame){
    return alert('비밀번호가 일치하지 않습니다.')
  }

  if(!isFullNameValidModify &&
    !isReenPasswordValidModify &&
    !isPostalCodeValidModify &&
    !isAddress1CodeValidModify &&
    !isAddress2CodeValidModify &&
    !isPhoneNumberValidModify){
      
      alert('데이터가 변경 됨.')
    }

    try{

      const data ={
        fullName,
        password: reenPassword,
        currentPassword: currentPassword,
        address:{
          postalCode : postalCode,
          address1  :address1,
          address2 : address2,
        },
        phoneNumbe: phoneNumber,
      }

      const result = await Api.patch(`/api/users/${sessionStorage.userid}`,'',data);
      console.log(result, "color: #ff0000;");
    }
    catch(e){
      e.message;
    }
}
