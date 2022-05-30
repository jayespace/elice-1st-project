function prepareModal() {
  $(document).ready(function () {
    // Activate tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Select/Deselect checkboxes
    var checkbox = $('table tbody input[type="checkbox"]');
    $("#selectAll").click(function () {
      if (this.checked) {
        checkbox.each(function () {
          this.checked = true;
        });
      } else {
        checkbox.each(function () {
          this.checked = false;
        });
      }
    });
    checkbox.click(function () {
      if (!this.checked) {
        $("#selectAll").prop("checked", false);
      }
    });



    // const edit = document.querySelectorAll(".td_edit")
    // edit.forEach(e =>{
    //     e.addEventListener('click',()=>console.log('hi'));
    // })
  }); 
}

function searchAddressByDaumPost(){
  return new Promise((resole) =>{
    new daum.Postcode({
      oncomplete: function(data) {
          let addr = ''; // 주소 변수

          let buildingName = data.buildingName ? ` (${data.buildingName})`:''; 
          //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
          if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
              addr = `${data.roadAddress}${buildingName}`;
          } else { // 사용자가 지번 주소를 선택했을 경우(J)
              addr = `${data.jibunAddress}${buildingName}`;
          }

          // 우편번호와 주소 정보를 해당 필드에 넣는다.
          const zonecode = data.zonecode;
          const address = addr;
          // 커서를 상세주소 필드로 이동한다.
          resole({zonecode, address});
      }
  }).open();
  })
}

import * as Api from "/api.js";
import { randomId } from "/useful-functions.js";

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


addAllElements();
addAllEvents();
prepareModal();


// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  createUserInfoToTable();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  EditSearchAddressButton.addEventListener('click',insertAddressInputsByDumPost);
}

async function updateUserInfo(){
  const id = globalThis.userId
  
  Api.patch
  
}

async function insertAddressInputsByDumPost(){
  const {zonecode, address} = await searchAddressByDaumPost();
  EditPostalCodeInput.value = zonecode;
  EditAddress1Input.value = address;
}
async function createUserInfoToTable() {
  const {users} = await Api.get('/api/admin/userlist','');
  console.log(users);
  users.forEach(({_id, fullName, email, address, phoneNumber, role}) =>{
      //불확실한 값
      const addr = address
      ?
      `
      (${address.postalCode})${address.address1} ${address.address2 ?? ''}
      `
      :
      ``;
      const phNum = phoneNumber ?? '';
      createUserInfoRow(_id, fullName, email, addr, role, phNum);
    });

    const edit = document.querySelectorAll('.td_edit');
    edit.forEach(e => e.addEventListener('click', setUserInfoToEditModal));

    function createUserInfoRow(_id, fullName, email, address, role, phoneNumber) {
      userInfo_table.insertAdjacentHTML(
        "beforeend",
          `
          <tr>
              <td>
                  <span class="custom-checkbox">
                      <input type="checkbox" id="checkbox1" name="options[]" value="1">
                      <label for="checkbox1"></label>
                  </span>
              </td>
              <td class="tb_username">${fullName}</td>
              <td class="tb_useremail">${email}</td>
              <td class="tb_address">${address}</td>
              <td class="tb_phonenumber">${phoneNumber}</td>
              <td class="tb_role">${role}</td>
              <td>
                  <a href="#editEmployeeModal" class="td_edit" data-toggle="modal" >
                      <i class="material-icons" data-delay='{"show":"5000", "hide":"3000"}' data-toggle="tooltip" title="Edit" data-id="${_id}">&#xE254;</i>
                  </a>
                  <a href="#deleteEmployeeModal" class="td_delete" data-toggle="modal">
                      <i class="material-icons" data-toggle="tooltip" title="Delete_userInfo"  data-id="${_id}">&#xE872;</i>
                  </a>
              </td>
          </tr>
          `
      );
    }
    async function setUserInfoToEditModal(e){
      const id = e.target.dataset.id;
      console.log("iddddddd",id);
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
