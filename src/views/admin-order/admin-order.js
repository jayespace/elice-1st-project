import {checkAdmin} from '/permission.js';
checkAdmin();

import * as Api from "/api.js";
import { searchAddressByDaumPost } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const userInfo_table = document.getElementById("userInfo-table");

//ed-modal
const EditFullNameInput = document.getElementById('EditFullNameInput');
const EditPostalCodeInput = document.getElementById('EditPostalCodeInput');
const EditPhoneNumberInput = document.getElementById('EditPhoneNumberInput');
const EditMessageInput = document.getElementById('EditMessageInput');
const EditAddress1Input = document.getElementById('EditAddress1Input');
const EditAddress2Input = document.getElementById('EditAddress2Input');

const EditOrderStatusSelectBox = document.getElementById('EditOrderStatusSelectBox');
const EditCsStatusSelectBox = document.getElementById('EditCsStatusSelectBox');

const EditSearchAddressButton = document.getElementById('EditSearchAddressButton');

const EditSubmitButton = document.getElementById('EditSubmitButton');

addAllElements();
addAllEvents();


// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  createUserInfoToTable();
  createOrderStatusOptions();
  createCsStatusOptions();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  EditSearchAddressButton.addEventListener('click',insertAddressInputsByDumPost);
  EditSubmitButton.addEventListener('click', modifyOlder);
}

async function modifyOlder(e){
  e.preventDefault();
  const id = globalThis.userId;
  const data = {};
  const EditFullName = EditFullNameInput.value;
  const EditPhoneNumber = EditPhoneNumberInput.value;
  const EditMessage = EditMessageInput.value;
  const EditPostalCode = EditPostalCodeInput.value;
  const EditAddress1 = EditAddress1Input.value;
  const EditAddress2 = EditAddress2Input.value;

  

  const EditOrderStatusSelect = EditOrderStatusSelectBox.value;
  const EditCsStatusSelect = EditCsStatusSelectBox.value;
  const address = {
    postalCode: EditPostalCode,
    address1: EditAddress1,
    address2: EditAddress2
  };


  data.fullNameTo = EditFullName;
  data.phoneNumberTo = EditPhoneNumber;
  data.address - address;
  data.messageTo = EditMessage;
  data.orderStatus = EditOrderStatusSelect;
  data.csStatus = EditCsStatusSelect;
 console.log(data);
  try{
    const result = await Api.patch('/api/orders',id,data);
    if(result){
      location.reload();
    }
  }catch(e){
    alert(e);
  }
}

async function createOrderStatusOptions(){
  try{
    const result = await Api.get('/api/orderStatus');
    if(result){
      result.forEach(({name}) => {
      EditOrderStatusSelectBox.insertAdjacentHTML(
        'beforeend',
        `<option value="${name}">${name}</option>`
      )
      });
    }
  }catch(e){
    console.error(e);
  }
}

async function createCsStatusOptions(){
  try{
    const result = await Api.get('/api/csStatus');
    console.log(result);
    if(result){
      result.forEach(({name}) => {
        EditCsStatusSelectBox.insertAdjacentHTML(
        'beforeend',
        `<option value="${name}">${name}</option>`
      )
      });
    }
  }catch(e){
    console.error(e);
  }
}


async function insertAddressInputsByDumPost(){
  const {zonecode, address} = await searchAddressByDaumPost();
  EditPostalCodeInput.value = zonecode;
  EditAddress1Input.value = address;
}
async function createUserInfoToTable() {
  const order = await Api.get('/api/orders','');
  console.log(order);
  order.forEach(({orderInfo, statusInfo}) =>{
      createUserInfoRow(orderInfo, statusInfo);
    });

    const edit = document.querySelectorAll('.td_edit');
    edit.forEach(e => e.addEventListener('click', setUserInfoToEditModal));
    const del = document.querySelectorAll('.td_delete');
    del.forEach(e => e.addEventListener('click', (e) => globalThis.userId = e.target.dataset.id));

    function createUserInfoRow(orderInfo, statusInfo) {
      const {_id, user, fullNameTo, phoneNumberTo, addressTo, messageTo, products} = orderInfo;
      const {orderStatus, csStatus} = statusInfo;
      userInfo_table.insertAdjacentHTML(
        "beforeend",
          `
          <tr>
              <td class="tb_buyer">${user.fullName}</td>
              <td class="tb_address">${addressTo.address1}</td>
              <td class="tb_receiver"><p>${fullNameTo}</p><p>${phoneNumberTo}</p></td>
              <td class="tb_products">${products.map(({name, qty, totalPrice}) =>(`<p>${name}  /  ${qty}개  /  ${totalPrice}원</p>`)).join('')}</td>
              <td class="tb_csStatus">${csStatus}</td>
              <td class="tb_orderStatus">${orderStatus}</td>
              <td>
                  <a href="#editUserInfoModal" class="td_edit" data-toggle="modal" data-id="${_id}" >
                      <i class="material-icons" data-toggle="tooltip" title="Edit" data-id="${_id}">&#xE254;</i>
                  </a>
              </td>
          </tr>
          `
      );
    }
    async function setUserInfoToEditModal(e){
      const id = e.target.dataset.id;
      globalThis.userId = id;
      const {orderInfo, statusInfo} = await Api.get('/api/orders',id);
      const {fullNameTo, phoneNumberTo, addressTo, messageTo} = orderInfo;
      const {orderStatus, csStatus} = statusInfo;
      EditFullNameInput.value = fullNameTo;
      EditPhoneNumberInput.value = phoneNumberTo;
      EditMessageInput.value = messageTo ?? '';
      if(addressTo){
        EditPostalCodeInput.value = addressTo.postalCode;
        EditAddress1Input.value = addressTo.address1;
        EditAddress2Input.value = addressTo.address2 ?? '';
      }
      else{
        EditPostalCodeInput.value = '';
        EditAddress1Input.value = '';
        EditAddress2Input.value = '';
      }
      EditPhoneNumberInput.value = phoneNumberTo ?? '';

      EditOrderStatusSelectBox.value = orderStatus;
      EditCsStatusSelectBox.value = csStatus;
  
    }
}
