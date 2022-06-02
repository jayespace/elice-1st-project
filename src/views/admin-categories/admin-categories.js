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

import * as Api from "/api.js";
import { randomId } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const category_table = document.getElementById("category-table");

//ed-modal
const EditNameInput = document.getElementById('EditNameInput')
// const EditFullNameInput = document.getElementById('EditFullNameInput');
// const EditEmailInput = document.getElementById('EditEmailInput');
// const EditPostalCodeInput = document.getElementById('EditPostalCodeInput');
// const EditAddress1Input = document.getElementById('EditAddress1Input');
// const EditAddress2Input = document.getElementById('EditAddress2Input');
// const EditPhoneNumberInput = document.getElementById('EditPhoneNumberInput');
// const EditRoleSelectBox = document.getElementById('EditRoleSelectBox');
// const EditSearchAddressButton = document.getElementById('EditSearchAddressButton');
// const EditSubmitButton = document.getElementById('EditSubmitButton');


addAllElements();
addAllEvents();
prepareModal();


// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  createCategoriesToTable();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  // EditSearchAddressButton.addEventListener('click',insertAddressInputsByDumPost);
  // EditSubmitButton.addEventListener('click', updateUserInfo);
}

async function updateUserInfo(){
  const id = globalThis.userId
  console.log(id);
}

async function deleteUserInfo(){
  const id = globalThis.userId
  console.log(id);
}
async function createCategoriesToTable() {
  const categories = await Api.get('/api/categories','');
  console.log(categories);
  categories.forEach(({_id, name, desc, createdAt, updatedAt}) =>{
      //불확실한 값
      

      createCategoryRow(_id, name, desc, createdAt, updatedAt);
    });

    const edit = document.querySelectorAll('.td_edit');
    edit.forEach(e => e.addEventListener('click', setCategoryInfoToEditModal));

    function createCategoryRow(_id, name, desc, createdAt, updatedAt) {
      category_table.insertAdjacentHTML(
        "beforeend",
          `
          <tr>
              <td>
                  <span class="custom-checkbox">
                      <input type="checkbox" id="checkbox1" name="options[]" value="1">
                      <label for="checkbox1"></label>
                  </span>
              </td>
              <td class="tb_username">${name}</td>
              <td class="tb_useremail">${desc}</td>
              <td class="tb_address">${createdAt}</td>
              <td class="tb_phonenumber">${updatedAt}</td>
              <td>
                  <a href="#editCategoryModal" class="td_edit" data-toggle="modal" >
                      <i class="material-icons" data-delay='{"show":"7000", "hide":"3000"}' data-toggle="tooltip" title="Edit" data-id="${_id}">&#xE254;</i>
                  </a>
                  <a href="#deleteCategoryModal" class="td_delete" data-toggle="modal">
                      <i class="material-icons" data-toggle="tooltip" title="Delete_Category"  data-id="${_id}">&#xE872;</i>
                  </a>
              </td>
          </tr>
          `
      );
    }
    async function setCategoryInfoToEditModal(e){
      const id = e.target.dataset.id;
      globalThis.categoryId = id;
      const userInfo = await Api.get('/api/categories',id);
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
