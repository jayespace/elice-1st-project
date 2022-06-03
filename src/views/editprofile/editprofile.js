//토큰이 없다면 로그인 페이지로 이동
if (!sessionStorage.getItem('token')) {
  const { pathname, search } = window.location;
  window.location.replace(`/login?previouspage=${pathname + search}`);
}

import * as Api from '/api.js';
import {
  activeModalFunction,
  searchAddressByDaumPost,
  insertImageFile,
} from '/useful-functions.js';

const profileHeadLabel = document.querySelector('#securityTitle');

const fullNameInput = document.getElementById('fullNameInput');
const currentPasswordInput = document.getElementById('currentPasswordInput');
//비밀번호 재생성 Inputs
const reenPasswordInput = document.getElementById('reenPasswordInput');
const reenPasswordConfirmInput = document.getElementById(
  'reenPasswordConfirmInput'
);
const postalCodeInput = document.getElementById('postalCodeInput');
const address1Input = document.getElementById('address1Input');
const address2Input = document.getElementById('address2Input');
const phoneNumberInput = document.getElementById('phoneNumberInput');

const searchAddressButton = document.getElementById('searchAddressButton');
const saveButton = document.getElementById('saveButton');
const deleteCompleteButton = document.getElementById('deleteCompleteButton');
const imageInput = document.getElementById('imageInput');
const image = document.querySelector('#profile-image');
let imagedata = '';

const userInfoObject = {};

activeModalFunction();
addAllElements();
addAllEvents();

//이미지 관련기능
async function changeImageFile(file) {
  if (file.target.files[0]) {
    imagedata = file.target.files[0];
    try {
      const imgSrc = await insertImageFile(file.target.files[0]);
      image.src = imgSrc;
      image.style.width = '100%';
      image.style.height = '100%';
    } catch (e) {
      console.error('이미지 관련 오류', e.massage);
    }
  }
}

async function addAllElements() {
  setUserInfoToInputs();
}

async function addAllEvents() {
  imageInput.addEventListener('change', changeImageFile);
  searchAddressButton.addEventListener('click', insertAddressToAddrInputs);
  saveButton.addEventListener('click', handlePatch);
  deleteCompleteButton.addEventListener('click', deleteAccount);
}

async function insertAddressToAddrInputs() {
  const { zonecode, address } = await searchAddressByDaumPost();
  postalCodeInput.value = zonecode;
  address1Input.value = address;
  address2Input.focus();
}
//계정삭제 관련
async function deleteAccount() {
  const userid = sessionStorage.getItem('userid');
  const currentPassword = currentPasswordInput.value;
  const isCurrentPasswordValid = currentPassword.length > 1;

  if (!isCurrentPasswordValid) {
    return alert('정보 삭제 시 현재 비빌번호를 입력해주세요.');
  }
  const data = {
    userid,
    currentPassword,
  };
  try {
    const result = await Api.delete(`/api/users`, userid, data);
    if (result) {
      location.href = '/login';
    }
  } catch (e) {}
}

//회원정보 셋팅
async function setUserInfoToInputs() {
  const userid = sessionStorage.getItem('userid');
  const data = await Api.get(`/api/users/${userid}`);
  const { fullName, email, password, address, phoneNumber } = data;

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
  userInfoObject.phoneNumber = phoneNumber ?? '';

  //input에 셋팅
  profileHeadLabel.insertAdjacentText('beforeend', `(${email})`);
  fullNameInput.value = fullName;
  currentPasswordInput.value = '';
  reenPasswordInput.value = '';
  reenPasswordConfirmInput.value = '';
  postalCodeInput.value = postalCode;
  address1Input.value = address1;
  address2Input.value = address2;
  phoneNumberInput.value = phoneNumber ?? '';
}
//회원정보 수정 진행
async function handlePatch(e) {
  e.preventDefault();

  const fullName = fullNameInput.value;
  const currentPassword = currentPasswordInput.value;
  const reenPassword = reenPasswordInput.value;
  const reenPasswordConfirm = reenPasswordConfirmInput.value;
  const postalCode = postalCodeInput.value;
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

  if (!isCurrentPasswordValid) {
    return alert('정보 수정 시 현재 비빌번호를 입력해주세요.');
  }

  if (!isReenPasswordSame) {
    return alert('비밀번호가 일치하지 않습니다.');
  }
  if (
    !isFullNameValidModify ||
    !isReenPasswordValidModify ||
    !isPostalCodeValidModify ||
    !isAddress1CodeValidModify ||
    !isAddress2CodeValidModify ||
    !isPhoneNumberValidModify
  ) {
    try {
      const data = {
        fullName,
        password: reenPassword,
        currentPassword: currentPassword,
        address: {
          postalCode: postalCode,
          address1: address1,
          address2: address2,
        },
        phoneNumber: phoneNumber,
      };

      const result = await Api.patch(
        `/api/users/${sessionStorage.userid}`,
        '',
        data
      );
      if (result) {
        location.href = '/';
      }
    } catch (e) {
      e.message;
    }
  }
}
