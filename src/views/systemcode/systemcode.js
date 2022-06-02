import * as Api from "/api.js";
import { randomId } from "/useful-functions.js";
import CreateTableHelper from "./CreateTableHelper.js";

const tbHead = document.getElementById('tbHead');
const tbBody = document.getElementById('tbBody');
const mdEdit = document.querySelector("#editModal");
const mdAdd = document.querySelector("#addModal");
const mdDel = document.querySelector("#deleteModal");

const selectAll = document.getElementById('selectAll');
const systemCodeList = document.getElementById('systemCodeList');

const EditSubmitButton = document.getElementById('EditSubmitButton');

addAllElements();
addAllEvents();


// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {

  await CreateTableHelper.initialize(systemCodeList, addSystemCodeEvent);
  const name = sessionStorage.getItem('syscode');
  new CreateTableHelper(name, tbHead, tbBody, mdEdit, mdAdd, mdDel).createTable();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  selectAll.addEventListener('change', selectAllCheckBox);

}
function selectAllCheckBox(e){
  console.log(e.target);
}
async function addSystemCodeEvent(e){
  const {id, name} = e.target.dataset;
  const table = new CreateTableHelper(name, tbHead, tbBody, mdEdit, mdAdd, mdDel);
  sessionStorage.setItem('syscode', name);
  table.createTable();
}

