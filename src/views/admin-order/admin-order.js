import {checkAdmin} from '/permission.js';
checkAdmin();

import * as Api from "/api.js";
import { searchAddressByDaumPost } from "/useful-functions.js";


const userOrderTable = document.getElementById("userInfo-table");
const editFullNameInput = document.getElementById('editFullNameInput');
const editPostalCodeInput = document.getElementById('editPostalCodeInput');
const editPhoneNumberInput = document.getElementById('editPhoneNumberInput');
const editMessageInput = document.getElementById('editMessageInput');
const editAddress1Input = document.getElementById('editAddress1Input');
const editAddress2Input = document.getElementById('editAddress2Input');
const editOrderStatusSelectBox = document.getElementById('editOrderStatusSelectBox');
const editCsStatusSelectBox = document.getElementById('editCsStatusSelectBox');
const editSearchAddressButton = document.getElementById('editSearchAddressButton');
const editSubmitButton = document.getElementById('editSubmitButton');

addAllElements();
addAllEvents();


async function addAllElements() {
  createOrderInfoToTable();
  createOrderStatusOptions();
  createCsStatusOptions();
}

async function addAllEvents() {
  editSearchAddressButton.addEventListener('click',insertAddressInputsByDumPost);
  editSubmitButton.addEventListener('click', modifyOlder);
}

/**
 * Author : Park Award
 * create At : 22-06-05
 * @param {event} e 
 * 주문 수정 Modal 의 Submit 버튼을 눌를 경우 실행되는 이벤트 입니다.
 */
async function modifyOlder(e){
  e.preventDefault();
  const id = globalThis.userId;
  const data = {};
  const editFullName = editFullNameInput.value;
  const editPhoneNumber = editPhoneNumberInput.value;
  const editMessage = editMessageInput.value;
  const editPostalCode = editPostalCodeInput.value;
  const editAddress1 = editAddress1Input.value;
  const editAddress2 = editAddress2Input.value;
  const editOrderStatusSelect = editOrderStatusSelectBox.value;
  const editCsStatusSelect = editCsStatusSelectBox.value;
  const address = {
    postalCode: editPostalCode,
    address1: editAddress1,
    address2: editAddress2
  };


  data.fullNameTo = editFullName;
  data.phoneNumberTo = editPhoneNumber;
  data.address - address;
  data.messageTo = editMessage;
  data.orderStatus = editOrderStatusSelect;
  data.csStatus = editCsStatusSelect;
  try{
    const result = await Api.patch('/api/orders',id,data);
    if(result){
      location.reload();
    }
  }catch(e){
    alert(e);
  }
}

/**
 * Author : Park Award
 * create At: 22-06-03
 * Modal의 OrderStatus SelectBox의 Option을 추가하는 함수입니다.
 */
async function createOrderStatusOptions(){
  try{
    const result = await Api.get('/api/orderStatus');
    if(result){
      result.forEach(({name}) => {
      editOrderStatusSelectBox.insertAdjacentHTML(
        'beforeend',
        `<option value="${name}">${name}</option>`
      )
      });
    }
  }catch(e){
    console.error(e);
  }
}

/**
 * Author : Park Award
 * create At: 22-06-03
 * Modal의 CsStatus SelectBox의 Option을 추가하는 함수입니다.
 */

async function createCsStatusOptions(){
  try{
    const result = await Api.get('/api/csStatus');
    console.log(result);
    if(result){
      result.forEach(({name}) => {
        editCsStatusSelectBox.insertAdjacentHTML(
        'beforeend',
        `<option value="${name}">${name}</option>`
      )
      });
    }
  }catch(e){
    console.error(e);
  }
}

/**
 * Author : Park Award
 * create At : 22-06-05
 * 다음Api에서 부터 데이터를 
 * editPostalCodeInput,
 * editAddress1Input 에 넣습니다.
 */

async function insertAddressInputsByDumPost(){
  const {zonecode, address} = await searchAddressByDaumPost();
  editPostalCodeInput.value = zonecode;
  editAddress1Input.value = address;
}

/**
 * Author : Park Award
 * create At : 22-06-05
 * 전체주문정보를 테이블에 데이터를를 생성합니다.
 */
async function createOrderInfoToTable() {
  const order = await Api.get('/api/orders','');
  console.log(order);
  order.forEach(({orderInfo, statusInfo}) =>{
    userOrderTable.append(createUserInfoRow(orderInfo, statusInfo));
    });
}

/**
 * Author : Park Award
 * create At : 22-06-05
 * @param {Object} orderInfo 
 * @param {Object} statusInfo 
 * @returns {Element} tr Element 입니다.
 * createOrderInfoToTable에 들어갈 ROW를 생성합니다.
 */
function createUserInfoRow(orderInfo, statusInfo) {
  const {_id, user, fullNameTo, phoneNumberTo, addressTo, messageTo, products} = orderInfo;
  const {orderStatus, csStatus} = statusInfo;
  const newTableRowNode = document.createElement('tr');
  newTableRowNode.innerHTML = 
      `
  
          <td class="tb_buyer">${user.fullName}</td>
          <td class="tb_address">${addressTo.address1}</td>
          <td class="tb_receiver"><p>${fullNameTo}</p><p>${phoneNumberTo}</p></td>
          <td class="tb_products">${products.map(({name, qty, totalPrice}) =>(`<p>${name}  /  ${qty}개  /  ${totalPrice}원</p>`)).join('')}</td>
          <td class="tb_csStatus">${csStatus}</td>
          <td class="tb_orderStatus">${orderStatus}</td>
      `
    const newBtnTr = document.createElement('td');
    newBtnTr.innerHTML=
      `
      <a href="#editUserInfoModal" class="td_edit" data-toggle="modal" data-id="${_id}" data-action="openeditModal" >
          <i class="material-icons" data-toggle="tooltip" title="edit" data-id="${_id}">&#xE254;</i>
      </a>
      ` 
    const aTag = newBtnTr.getElementsByTagName('a');
    for(let tag of aTag)tag .addEventListener('click',setUserInfoToEditModal);
  newTableRowNode.appendChild(newBtnTr);
  return newTableRowNode;
}
/**
 * Author : Park Award
 * @param {Event} e 
 * 수정버튼 눌를 시 해당 Row의 정보를 EditModal의 넣어줍니다.
 */
async function setUserInfoToEditModal(e){
  const id = e.target.dataset.id;
  globalThis.userId = id;
  const {orderInfo, statusInfo} = await Api.get('/api/orders',id);
  const {fullNameTo, phoneNumberTo, addressTo, messageTo} = orderInfo;
  const {orderStatus, csStatus} = statusInfo;
  editFullNameInput.value = fullNameTo;
  editPhoneNumberInput.value = phoneNumberTo;
  editMessageInput.value = messageTo ?? '';
  if(addressTo){
    editPostalCodeInput.value = addressTo.postalCode;
    editAddress1Input.value = addressTo.address1;
    editAddress2Input.value = addressTo.address2 ?? '';
  }
  else{
    editPostalCodeInput.value = '';
    editAddress1Input.value = '';
    editAddress2Input.value = '';
  }
  editPhoneNumberInput.value = phoneNumberTo ?? '';

  editOrderStatusSelectBox.value = orderStatus;
  editCsStatusSelectBox.value = csStatus;

}
