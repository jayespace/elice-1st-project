import {checkToken} from '/permission.js';
import * as Api from '/api.js';
import {
  activeModalFunction,
  searchAddressByDaumPost,
  insertImageFile,
} from '/useful-functions.js';

checkToken();
const profileHeadLabel = document.querySelector('#securityTitle');
const fullNameInput = document.getElementById('fullNameInput');
const currentPasswordInput = document.getElementById('currentPasswordInput');
const reenPasswordInput = document.getElementById('reenPasswordInput');
const reenPasswordConfirmInput = document.getElementById('reenPasswordConfirmInput');
const postalCodeInput = document.getElementById('postalCodeInput');
const address1Input = document.getElementById('address1Input');
const address2Input = document.getElementById('address2Input');
const phoneNumberInput = document.getElementById('phoneNumberInput');
const searchAddressButton = document.getElementById('searchAddressButton');
const saveButton = document.getElementById('saveButton');
const deleteCompleteButton = document.getElementById('deleteCompleteButton');
const imageInput = document.getElementById('imageInput');
const imageProfile = document.querySelector('#profile-image');
let imagedata = '';
const userInfoObject = {};

activeModalFunction();
addAllElements();
addAllEvents();

async function addAllElements() {
  setUserInfoToInputs();
}

async function addAllEvents() {
  imageInput.addEventListener('change', changeImageFile);
  searchAddressButton.addEventListener('click', insertAddressToAddrInputs);
  saveButton.addEventListener('click', editUserProfile);
  deleteCompleteButton.addEventListener('click', deleteAccount);
}

/**
 * Author : ParkAward
 * create At : 22-06-05
 * @param {Event} file 
 * 사용자가 삽인한 ImageFile을 보여주고 데이터를 imagedata에 보관합니다.
 */
 async function changeImageFile(file) {
  if (file.target.files[0]) {
    imagedata = file.target.files[0];
    try {
      const imgSrc = await insertImageFile(file.target.files[0]);
      imageProfile.src = imgSrc;
      imageProfile.style.width = '100%';
      imageProfile.style.height = '100%';
    } catch (e) {
      console.error('이미지 관련 오류', e.massage);
    }
  }
}

/**
 * 다음 API를 사용하고 AddrInput 삽입합니다.
 */
async function insertAddressToAddrInputs() {
  const { zonecode, address } = await searchAddressByDaumPost();
  postalCodeInput.value = zonecode;
  address1Input.value = address;
  address2Input.focus();
}

/**
 * Author : Park Award
 * create At : 22-06-02
 * 사용자의 정보를 삭제합니다.
 * @return 잘못된 행동이면 바로 멈춥니다.
 */
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

/**
 * Author : Park Award
 * create At: 22-06-02
 * 사용자의 정보를 삽입합니다.
 */
async function setUserInfoToInputs() {
  const userid = sessionStorage.getItem('userid');
  const data = await Api.get(`/api/users/${userid}`);
  const { image, fullName, email, password, address, phoneNumber } = data;

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
  imageProfile.src = image;

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

/**
 * Author : Park Award
 * create At : 22-06-02
 * @param {Event} e 
 * @returns {alert} 잘못된 행동이라면 즉시 멈춥니다.
 * 사용자의 기존 정보와 대조하여 변경된 데이터를 서버에 보냅니다.
 */
async function editUserProfile(e) {
  e.preventDefault();

  const fullName = fullNameInput.value;
  const currentPassword = currentPasswordInput.value;
  const reenPassword = reenPasswordInput.value;
  const reenPasswordConfirm = reenPasswordConfirmInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;
  const phoneNumber = phoneNumberInput.value;

  const isFullNameValidModify = fullName === userInfoObject.fullName;
  const isCurrentPasswordValid = currentPassword.length > 1;
  const isReenPasswordValidModify = reenPassword.length < 1;
  const isReenPasswordSame = reenPassword === reenPasswordConfirm;
  const isPostalCodeValidModify = postalCode+"" === userInfoObject.postalCode;
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
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("password", reenPassword);
    formData.append("currentPassword", currentPassword);
    formData.append("postalCode", postalCode);
    formData.append("address1", address1);
    formData.append("address2", address2);
    formData.append("phoneNumber", phoneNumber);
    formData.append("image", imagedata);

    try {
      const result = await Api.patchMulti(
        '/api/users',sessionStorage.userid, formData
      );
      if (result) {
        location.href = '/';
      }
    } catch (e) {
      alert(e.message);
    }
  }
}
