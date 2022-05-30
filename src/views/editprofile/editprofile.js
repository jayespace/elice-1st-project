//토큰이 없다면 로그인 페이지로 이동
if(!sessionStorage.getItem("token")){
  const {pathname, search}= window.location;
  window.location.replace(`/login?previouspage=${pathname + search}`);
}

import * as Api from '/api.js';
import { randomId } from '/useful-functions.js';
import {prepareModal, DaumJibunAPI} from './profile-utils.js'

const profileHeadLabel = document.querySelector('.profile-header h1');

const fullNameInput = document.getElementById('fullNameInput');
const currentPasswordInput = document.getElementById('currentPasswordInput');
//비밀번호 재생성 Inputs 
const reenPasswordInput = document.getElementById('reenPasswordInput')
const reenPasswordConfirmInput = document.getElementById('reenPasswordConfirmInput');
const postalCodeInput = document.getElementById('postalCodeInput');
const address1Input = document.getElementById('address1Input');
const address2Input = document.getElementById('address2Input');
const phoneNumberInput = document.getElementById('phoneNumberInput');

const imageInput = document.getElementById('imageInput');
const searchAddressButton = document.getElementById("searchAddressButton");
const saveButton = document.getElementById('saveButton');
const deleteCompleteButton = document.getElementById('deleteCompleteButton');

const userInfoObject = {};


prepareModal();
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
  deleteCompleteButton.addEventListener('click', deleteAccount);
}

//계정삭제 관련
async function deleteAccount(){
  const userid = sessionStorage.getItem("userid");
  const currentPassword = currentPasswordInput.value;
  const isCurrentPasswordValid = currentPassword.length > 1;
  
  if(!isCurrentPasswordValid){
    return alert('정보 수정 시 현재 비빌번호를 입력해주세요.')
  }

  const data ={
    userid,
    currentPassword,
  }
  try{
  const result = await Api.delete(`/api/users`, userid, data);
  if(result){
    location.href = '/login'
  }
  }catch(e){
  }
}

//회원정보 셋팅
async function setUserInfoToInputs(){
  const userid = sessionStorage.getItem("userid");
  const data = await Api.get(`/api/users/${userid}`);
  const {fullName, email, password, address, phoneNumber} = data;
  
  //가져온 불확실한 정보 유효성 검사
  const postalCode = address ? address.postalCode : '';
  const address1 = address ? address.address1 : '';
  const address2 = address ? address.address2 : '';

  //userInfo 저장
  userInfoObject.fullName = fullName;
  userInfoObject.password = password;
  userInfoObject.postalCode = postalCode;
  userInfoObject.address1 = address1;
  userInfoObject.address2 = address2;
  userInfoObject.phoneNumber = phoneNumber;

  //input에 셋팅
  profileHeadLabel.insertAdjacentText('beforeend', `(${email})`);
  fullNameInput.value = fullName;
  currentPasswordInput.value = '';
  reenPasswordInput.value = '';
  reenPasswordConfirmInput.value ='';  
  postalCodeInput.value = postalCode;
  address1Input.value = address1;
  address2Input.value = address2;
  phoneNumberInput.value = phoneNumber; 

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

  const isFullNameValidModify = fullName === userInfoObject.fullName;
  const isCurrentPasswordValid = currentPassword.length > 1;
  const isReenPasswordValidModify = reenPassword.length < 1;
  const isReenPasswordSame = reenPassword === reenPasswordConfirm;
  const isPostalCodeValidModify = postalCode === userInfoObject.postalCode;
  const isAddress1CodeValidModify = address1 === userInfoObject.address2Code;
  const isAddress2CodeValidModify = address2 === userInfoObject.address2Code;
  const isPhoneNumberValidModify = phoneNumber === userInfoObject.phoneNumber;

  if(!isCurrentPasswordValid){
    return alert('정보 수정 시 현재 비빌번호를 입력해주세요.')
  }

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
        phoneNumber: phoneNumber,
      }

      const result = await Api.patch(`/api/users/${sessionStorage.userid}`,'',data);
      console.log(result, "color: #ff0000;");
      if(result){
        reenPasswordInput.value='';
        reenPasswordConfirmInput.value='';
        location.href = '/'
      }
    }
    catch(e){
      e.message;
    }
  }
}
