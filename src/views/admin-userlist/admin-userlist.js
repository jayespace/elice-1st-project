import { checkAdmin } from '/permission.js';
checkAdmin();

import * as Api from "/api.js";
import { searchAddressByDaumPost } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const userInfo_table = document.getElementById("userInfo-table");

//ed-modal
const editFullNameInput = document.getElementById('editFullNameInput');
const editEmailInput = document.getElementById('editEmailInput');
const editPostalCodeInput = document.getElementById('editPostalCodeInput');
const editAddress1Input = document.getElementById('editAddress1Input');
const editAddress2Input = document.getElementById('editAddress2Input');
const editPhoneNumberInput = document.getElementById('editPhoneNumberInput');
const editRoleSelectBox = document.getElementById('editRoleSelectBox');
const editSearchAddressButton = document.getElementById('editSearchAddressButton');
const editSubmitButton = document.getElementById('editSubmitButton');
const ChangeSubmitButton = document.getElementById('ChangeSubmitButton');


addAllElements();
addAllEvents();


// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  history.replaceState({}, null, location.pathname);
  createUserInfoToTable();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  editSearchAddressButton.addEventListener('click', insertAddressInputsByDumPost);
  editSubmitButton.addEventListener('click', updateUserPermission);
  ChangeSubmitButton.addEventListener('click', changeUserPassword)
}

/**
 * Author : Park Award
 * create At : 22-06-05 
 * @param {event} e 
 * 유저의 권한을 변경하는 함수입니다.
 */
async function updateUserPermission(e) {
  const id = globalThis.userId
  const data = {}
  data.role = editRoleSelectBox.value;
  try {
    const result = await Api.patch('/api/admin/users', id, data);
    if (result) {
      alert('성공적 권한 변경')
    }
  } catch (e) {
    console.error('정보권한변경관련 : ', e);
  }
}

/**
 * Author : Park Award
 * @param {Event} e 
 * 사용자의 비밀번호를 변경합니다.
 * 그리고 해당 Email에 임시비밀번호를 발송합니다.
 */
async function changeUserPassword(e) {
  e.preventDefault();
  console.log(globalThis.email);
  try {
    const result = await Api.post('/api/user/reset-password', { email: globalThis.email });
    // 비밀번호 찾기 성공 알림
    if (result) {
      alert(`임시 비밀번호가 발급되었습니다. 이메일을 확인해주세요.`);
      location.reload();
    }
  } catch (e) {
    console.error('정보삭제관련 : ', e);
  }
}

/**
 * 다음 API를 사용하고 Input에 데이터를 넣습니다.
 */
async function insertAddressInputsByDumPost() {
  const { zonecode, address } = await searchAddressByDaumPost();
  editPostalCodeInput.value = zonecode;
  editAddress1Input.value = address;
}

/**
 * Author : Park Award
 * create At : 22-06-05
 * API로 부터 받은 사용자 정보를 Table에 생성합니다.
 */
async function createUserInfoToTable() {
  const { users } = await Api.get('/api/admin/userlist', '');
  console.log(users);
  users.forEach(({ image, _id, fullName, email, address, phoneNumber, role }) => {
    const addr = address?`(${address.postalCode ?? ''})${address.address1 ?? ''} ${address.address2 ?? ''}`:'';
    const phNum = phoneNumber ?? '';
    userInfo_table.appendChild(createUserInfoRow(image, _id, fullName, email, addr, role, phNum));
  });
}

/**
 * Author : Park Award
 * create At : 22-06-05
 * @param {Url} image 
 * @param {String} _id 
 * @param {String} fullName 
 * @param {String} email 
 * @param {String} address 
 * @param {String} role 
 * @param {String} phoneNumber 
 * @returns {Element}
 * 사용자의 데이터가 들어간 테이블 로우를 Element를 반환합니다.
 */
function createUserInfoRow(image, _id, fullName, email, address, role, phoneNumber) {
  const newNode = document.createElement('tr');
  newNode.innerHTML = `
      <tr>
          <td class="tb_image"><img src='${image}'></td>
          <td class="tb_username">${fullName}</td>
          <td class="tb_useremail">${email}</td>
          <td class="tb_address">${address}</td>
          <td class="tb_phonenumber">${phoneNumber}</td>
          <td class="tb_role">${role}</td>
          <td>
          </td>
      </tr>
      `
  const newChildNode = document.createElement('td');
  newChildNode.innerHTML = `
    <a href="#editUserInfoModal" class="td_edit" data-toggle="modal" data-id="${_id}" >
      <i class="material-icons" data-toggle="tooltip" title="edit" data-id="${_id}">&#xE254;</i>
    </a>
    <a href="#deleteUserInfoModal" class="td_delete" data-toggle="modal" data-id="${_id}" data-email="${email}">
      <i class="material-icons" data-toggle="tooltip" title="Delete_userInfo"  data-id="${_id}" data-email="${email}">&#xf0d2;</i>
    </a>
  `;
  const aTags = newChildNode.getElementsByTagName('a');
  for (let tag of aTags) {
    if (tag.classList.contains('td_edit')) {
      tag.addEventListener('click', setUserInfoToEditModal);
    }
    else {
      tag.addEventListener('click', e => {
        globalThis.userId = e.target.dataset.id
        globalThis.email = e.target.dataset.email
      });
    }
  }
  newNode.appendChild(newChildNode);
  return newNode;
}

/**
 * Author : Park Award
 * create At : 22-06-05
 * @param {Event} e 
 * Edit Modal에 해당 Row의 사용자 정보를 넣습니다
 */
async function setUserInfoToEditModal(e) {
  const id = e.target.dataset.id;
  globalThis.userId = id;
  const userInfo = await Api.get('/api/admin/users', id);
  console.log(userInfo);
  const { email, fullName, address, phoneNumber, role } = userInfo;
  editFullNameInput.value = fullName;
  editEmailInput.value = email;
  if (address) {
    editPostalCodeInput.value = address.postalCode;
    editAddress1Input.value = address.address1;
    editAddress2Input.value = address.address2 ?? '';
  }
  else {
    editPostalCodeInput.value = '';
    editAddress1Input.value = '';
    editAddress2Input.value = '';
  }
  editPhoneNumberInput.value = phoneNumber ?? '';

  const options = editRoleSelectBox.options
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === role) {
      options[i].selected = true;
    }
  }

}