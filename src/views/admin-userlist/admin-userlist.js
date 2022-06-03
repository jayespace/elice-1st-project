import * as Api from "/api.js";
import { searchAddressByDaumPost } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const userInfo_table = document.getElementById("userInfo-table");

//ed-modal
const EditFullNameInput = document.getElementById('EditFullNameInput');
const EditEmailInput = document.getElementById('EditEmailInput');
const EditPostalCodeInput = document.getElementById('EditPostalCodeInput');
const EditAddress1Input = document.getElementById('EditAddress1Input');
const EditAddress2Input = document.getElementById('EditAddress2Input');
const EditPhoneNumberInput = document.getElementById('EditPhoneNumberInput');
const EditRoleSelectBox = document.getElementById('EditRoleSelectBox');
const EditSearchAddressButton = document.getElementById('EditSearchAddressButton');
const EditSubmitButton = document.getElementById('EditSubmitButton');
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
  EditSearchAddressButton.addEventListener('click',insertAddressInputsByDumPost);
  EditSubmitButton.addEventListener('click', updateUserPermission);
  ChangeSubmitButton.addEventListener('click', changeUserPassword)
}

async function updateUserPermission(e){
  console.log(globalThis.email);

  const id = globalThis.userId
  const data = {}
  data.role = EditRoleSelectBox.value;
  try{
    const result = await Api.patch('/api/admin/users',id,data);
    if(result){
      alert('성공적 권한 변경')
    }
  }catch(e){
    console.error('정보권한변경관련 : ',e);
  }
}

async function changeUserPassword(e){
  console.log(globalThis.email);
  try {
    const result = await Api.post('/api/user/reset-password',  {email:globalThis.email});
    // 비밀번호 찾기 성공 알림
    if(result)alert(`임시 비밀번호가 발급되었습니다. 이메일을 확인해주세요.`);
  }catch(e){
    console.error('정보삭제관련 : ',e);
  }
}

async function insertAddressInputsByDumPost(){
  const {zonecode, address} = await searchAddressByDaumPost();
  EditPostalCodeInput.value = zonecode;
  EditAddress1Input.value = address;
}
async function createUserInfoToTable() {
  const {users} = await Api.get('/api/admin/userlist','');
  console.log(users);
  users.forEach(({image, _id, fullName, email, address, phoneNumber, role}) =>{
      //불확실한 값
      const addr = address
      ?
      `
      (${address.postalCode})${address.address1} ${address.address2 ?? ''}
      `
      :
      ``;
      const phNum = phoneNumber ?? '';
      createUserInfoRow(image, _id, fullName, email, addr, role, phNum);
    });

    const edit = document.querySelectorAll('.td_edit');
    edit.forEach(e => e.addEventListener('click', setUserInfoToEditModal));
    const del = document.querySelectorAll('.td_delete');
    del.forEach(e => e.addEventListener('click', (e) => {
      globalThis.userId = e.target.dataset.id
      globalThis.email = e.target.dataset.email
    }));

    function createUserInfoRow(image, _id, fullName, email, address, role, phoneNumber) {
      userInfo_table.insertAdjacentHTML(
        "beforeend",
          `
          <tr>
              <td class="tb_image"><img src='${image}'></td>
              <td class="tb_username">${fullName}</td>
              <td class="tb_useremail">${email}</td>
              <td class="tb_address">${address}</td>
              <td class="tb_phonenumber">${phoneNumber}</td>
              <td class="tb_role">${role}</td>
              <td>
                  <a href="#editUserInfoModal" class="td_edit" data-toggle="modal" data-id="${_id}" >
                      <i class="material-icons" data-toggle="tooltip" title="Edit" data-id="${_id}">&#xE254;</i>
                  </a>
                  <a href="#deleteUserInfoModal" class="td_delete" data-toggle="modal" data-id="${_id}" data-email="${email}">
                      <i class="material-icons" data-toggle="tooltip" title="Delete_userInfo"  data-id="${_id}" data-email="${email}">&#xf0d2;</i>
                  </a>
              </td>
          </tr>
          `
      );
    }
    async function setUserInfoToEditModal(e){
      const id = e.target.dataset.id;
      globalThis.userId = id;
      const userInfo = await Api.get('/api/admin/users',id);
      const {email, fullName, address, phoneNumber, role} = userInfo;
      EditFullNameInput.value = fullName;
      EditEmailInput.value = email;
      if(address){
        EditPostalCodeInput.value = address.postalCode;
        EditAddress1Input.value = address.address1;
        EditAddress2Input.value = address.address2 ?? '';
      }
      else{
        EditPostalCodeInput.value = '';
        EditAddress1Input.value = '';
        EditAddress2Input.value = '';
      }
      EditPhoneNumberInput.value = phoneNumber ?? '';
  
      const options = EditRoleSelectBox.options
      for(let i = 0; i <options.length; i++){
        if(options[i].value === role){
          options[i].selected = true;
        }
      }
  
    }
}
