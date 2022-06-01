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
  });
}

import * as Api from "/api.js";
import { randomId } from "/useful-functions.js";

// // 요소(element), input 혹은 상수
// const category_table = document.getElementById("category-table");

// //ed-modal
// const EditNameInput = document.getElementById("EditNameInput");
// // const EditFullNameInput = document.getElementById('EditFullNameInput');
// // const EditEmailInput = document.getElementById('EditEmailInput');
// // const EditPostalCodeInput = document.getElementById('EditPostalCodeInput');
// // const EditAddress1Input = document.getElementById('EditAddress1Input');
// // const EditAddress2Input = document.getElementById('EditAddress2Input');
// // const EditPhoneNumberInput = document.getElementById('EditPhoneNumberInput');
// // const EditRoleSelectBox = document.getElementById('EditRoleSelectBox');
// // const EditSearchAddressButton = document.getElementById('EditSearchAddressButton');
// // const EditSubmitButton = document.getElementById('EditSubmitButton');

class CreateTableHelper{
    
  
  constructor(name){
    this.name = name;
  }

  static createMenu(sysCodes){
    function createButtons(sysCodeData){
      function createButton(_id, name){
      return `
      <button class="button m-1" data-id="${_id}" data-name="${name}">
        ${name}
      </button>
      `
      }
      return sysCodeData.map(({_id, name})=> createButton(_id, name)).join('');
    }
    return createButtons(sysCodes);
  }

  async createTable(tbHead, tbBody){
    const data = await translateSysCodeToApi(this.name,"all")();
    console.log('createHAED',data);

    tbHead.innerHTML = this.createHtmlHelper('HEAD')(data);
    tbBody.innerHTML = this.createHtmlHelper('BODY')(data);
  }


  createHtmlHelper(Type){
    console.log('execute HTMLHelper', Type);
    switch(Type){
      case 'HEAD':return function(keys) {
        keys = Object.keys(keys[0]);
        let head = 
        `
        <th>
          <span class="custom-checkbox">
              <input type="checkbox" id="selectAll">
              <label for="selectAll"></label>
          </span>
        </th>
        `
        keys.forEach(keys => head += `<th>${keys}</th>`)
        return head;
      }
      case 'BODY':return function(data){
        function createTableRow(value) {
          value = Object.values(value);
          function createTabLeData(value){
            return value.map(e => `<td>${e}</td>`).join('');
          }
          let row = 
          `
          <tr>
            <td>
                <span class="custom-checkbox">
                    <input type="checkbox" id="checkbox1" name="options[]" value="1">
                    <label for="checkbox1"></label>
                </span>
            </td>
            ${createTabLeData(value)}
            <td>
                <a href="#editCategoryModal" class="td_edit" data-toggle="modal" >
                    <i class="material-icons" data-delay='{"show":"7000", "hide":"3000"}' data-toggle="tooltip" title="Edit" data-id="${value[0]}">&#xE254;</i>
                </a>
                <a href="#deleteCategoryModal" class="td_delete" data-toggle="modal">
                    <i class="material-icons" data-toggle="tooltip" title="Delete_Category"  data-id="${value[0]}">&#xE872;</i>
                </a>
            </td>
          </tr>
          `
          return row;
        }
        return data.map(createTableRow).join('');
      }
    }
  }
}

function translateSysCodeToApi(syscode, type){
  switch(type){
    case "all": return () => Api.get(`/api/${syscode}`);
    case "search": return (params) => Api.get(`/api/${syscode}`,params);
    case "create": return (data) => Api.post(`/api/${syscode}`, data);
    case "modify": return (params, data) => Api.patch(`/api/${syscode}`, params, data);
    case "delete": return (params, data) => Api.delete(`/api/${syscode}`, params, data);
  }
  return new Error("동작실패");
}
const tbHead = document.getElementById('tbHead');
const tbBody = document.getElementById('tbBody');

const td_del_ok = document.getElementById('td_del_ok');

addAllElements();
addAllEvents();


// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
//   createCategoriesToTable();
  await createMenu();
  prepareModal();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  td_del_ok.addEventListener('click', (e) =>{
    e.preventDefault();
    console.log(e.dataset.id);
  })
    // await createMenuToSystemCodeList();
}
async function createMenu(){
  const sysCodes = await Api.get('/api/admin/systemCodes');
  const menu = CreateTableHelper.createMenu(sysCodes);
  const systemCodeList = document.getElementById('systemCodeList');
  systemCodeList.insertAdjacentHTML("beforeend", menu);

  systemCodeList.querySelectorAll('button').forEach(e=>e.addEventListener('click',createTable));
  async function createTable(e){
    const {id, name} = e.target.dataset;
    const helper = new CreateTableHelper(name);
    const table = await helper.createTable(tbHead, tbBody);
    console.log('table', table);
  }
}

