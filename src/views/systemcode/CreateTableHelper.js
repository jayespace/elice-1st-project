import * as Api from "/api.js";

class CreateTableHelper {
    ELE_HEAD = 1;
    ELE_BODY = 2;
    ELE_EDIT = 3;
    ELE_ADD = 4;

    API_ALL = 0;
    API_SEARCH = 1;
    API_CREATE = 2;
    API_MODIFY = 3;
    API_DELETE = 4;
  // How to Use translateSysCodeToApi @params (sysCode, API_TYPE)
  currentId = "";

  constructor(sysCode, tbHead, tbBody, mdEdit, mdAdd, mdDel) {
    this.sysCode = sysCode;
    this.tbHead = tbHead;
    this.tbBody = tbBody;
    this.tbBody = tbBody;
    this.mdEdit = mdEdit;
    this.mdAdd = mdAdd;
    this.mdDel = mdDel;
  }
  // 초기 생성시 도움주는 함수
  static async initialize(ButtonArea, callback) {
    const tags = await this.createSysCodesButtonElement();
    ButtonArea.insertAdjacentHTML("beforeend", tags);
    ButtonArea.querySelectorAll("button").forEach((e) => {
      e.addEventListener("click", callback);
    });
  }
  static async createSysCodesButtonElement() {
    const sysCodes = await Api.get("/api/admin/systemCodes");
    if(!sessionStorage.getItem('syscode')){
        sessionStorage.setItem('syscode', sysCodes[0].name);
    }
    function createButton(_id, name) {
      return `
        <button class="button m-1" data-id="${_id}" data-name="${name}">
          ${name}
        </button>
        `;
    }
    return sysCodes.map(({ _id, name }) => createButton(_id, name)).join("");
  }

  async createTable() {
    const fn = await this.translateSysCodeToApi(this.sysCode, this.API_ALL);
    const data = await fn();
    this.createTableHead(data);
    this.createTableBody(data);
    this.createModal(data);
  }
 

  async createModal(data) {
    this.createInsertModal(data);
    this.createEditModal(data);
    this.createDeleteModal(data);
  }

  createTableHead(data) {
    const fn = this.createHtmlHelper(this.ELE_HEAD);
    this.tbHead.innerHTML = fn(data);
  }

  createEditModal(data){
    const mdEdit_body = this.mdEdit.querySelector('.modal-body');
    const {name, desc} = data[0];
    const inputData = desc? {name, desc} : {name};
    const fn = this.createHtmlHelper(this.ELE_EDIT);
    mdEdit_body.innerHTML = fn(inputData);

    const modify = async e =>{
        e.preventDefault();
        const data = {}
        const key = Object.keys(inputData);
        for(let i = 0; i < key.length; i++){
            data[`${key[i]}`] = document.getElementById(`Edit_${key[i]}`).value;
          }
        try{
            const fnAPI = await this.translateSysCodeToApi(this.sysCode, this.API_MODIFY);
            const result = await fnAPI(this.currentId, data);
            if(result){
                // alert("성공적 전송");
                location.reload();
            }
        }catch(e){
            console.error(e)
        }
    }

    this.mdEdit.querySelector('.modal-footer > .md-ok')
        .addEventListener('click',modify);
  }

  createInsertModal(data){
    const mdAdd_body = this.mdAdd.querySelector('.modal-body');
    const {name, desc} = data[0];
    const inputData = desc? {name, desc} : {name};
    const fn = this.createHtmlHelper(this.ELE_ADD);

    mdAdd_body.innerHTML = fn(inputData);
    
    const save = async(e) =>{
        e.preventDefault();
        const data = {}
        const key = Object.keys(inputData);
        // const value = Object.values(inputData);
        for(let i = 0; i < key.length; i++){
            data[`${key[i]}`] = document.getElementById(`Add_${key[i]}`).value;
          }
        try{
            const fnAPI = await this.translateSysCodeToApi(this.sysCode, this.API_CREATE);
            const result = await fnAPI(data);
            if(result){
                // alert("성공적 전송");
                location.reload();
            }
        }catch(e){
            console.error(e)
        }
    }

    this.mdAdd.querySelector('.md-ok').
        addEventListener('click', save);
    
  }

  createTableBody(data) {
    const fn = this.createHtmlHelper(this.ELE_BODY);
    this.tbBody.innerHTML = fn(data);

    const eventsTableBodyATags = async(e) =>{
      this.currentId = e.target.dataset.id;
        //Edit Modal 데이터 넣기
      if(e.target.dataset.do == 'Edit'){
          const fn = await this.translateSysCodeToApi(this.sysCode, this.API_SEARCH);
          const {name, desc} = await fn(this.currentId);
          const inputData = desc?{name, desc}:{name};
          /**
           * Tags Pattern
           * "Edit_${attr}
           */
          const key = Object.keys(inputData);
          const value = Object.values(inputData);
          for(let i = 0; i < key.length; i++){
            document.getElementById(`Edit_${key[i]}`).value = value[i];
          }
        }
    }
    //body A Tag Event
    this.tbBody.querySelectorAll("a").forEach((e) => {
        e.addEventListener("click", eventsTableBodyATags);
        });
  }
  createDeleteModal(data){
    //사실 data 필요없음 삭제하면 그만이야~
    const deleteEvent = async e => {
        e.preventDefault();
        try{
        const fn = await this.translateSysCodeToApi(this.sysCode ,this.API_DELETE)
        const result = fn(this.currentId);
        if(result){
            // alert("성공적으로 삭제됨");
            location.reload();
        }
        }catch(e){
            console.error(e);
        }
    }
    this.mdDel.querySelector('.modal-footer > .md-ok')
        .addEventListener('click',deleteEvent)
  }

  // Tag 생성기
  createHtmlHelper(Type) {
    switch (Type) {
      case this.ELE_HEAD:
        return function (keys) {
          keys = Object.keys(keys[0]);
          let head = '';
          keys.forEach((keys) => (head += `<th>${keys}</th>`));
          return head;
        };
      case this.ELE_BODY:
        return function (data) {
          function createTableRow(value) {
            value = Object.values(value);
            function createTabLeData(value) {
              return value.map((e) => `<td>${e}</td>`).join("");
            }
            let row = `
                ${createTabLeData(value)}
                <td>
                    <a href="#editModal" class="td_edit" data-toggle="modal" data-do="Edit" data-id="${
                      value[0]
                    }">
                        <i class="material-icons" data-toggle="tooltip" title="Edit" data-do="Edit" data-id="${
                          value[0]
                        }">&#xE254;</i>
                    </a>
                    <a href="#deleteModal" class="td_delete" data-toggle="modal" data-do="Del" data-id="${
                      value[0]
                    }">
                        <i class="material-icons" data-toggle="tooltip" title="delete" data-do="DEL" data-id="${
                          value[0]
                        }">&#xE872;</i>
                    </a>
                </td>
              </tr>
              `;
            return row;
          }
          return data.map(createTableRow).join("");
        };
      case this.ELE_EDIT:
        return function (record) {
          // record = Object.keys(record[0])
          record = Object.keys(record);
          function createBasicInputHTML(attr) {
            return `
               <div class="form-group">
                  <label>${attr}</label>
                  <input id="Edit_${attr}" type="text" class="form-control" required>
              </div>`;
          }
          return record.map(createBasicInputHTML).join("");
        };
      case this.ELE_ADD:
        return function (record) {
          // record = Object.keys(record[0])
          record = Object.keys(record);
          function createBasicInputHTML(attr) {
            return `
               <div class="form-group">
                  <label>${attr}</label>
                  <input id="Add_${attr}" type="text" class="form-control" required>
              </div>`;
          }
          return record.map(createBasicInputHTML).join("");
        };
    }
  }
  //systemCode 관련 API 호출기
  async translateSysCodeToApi(syscode, type) {
    switch (type) {
      case this.API_ALL:
        return () => Api.get(`/api/${syscode}`);
      case this.API_SEARCH:
        return (params) => Api.get(`/api/${syscode}`, params);
      case this.API_CREATE:
        return (data) => Api.post(`/api/${syscode}`, data);
      case this.API_MODIFY:
        return (params, data) => Api.patch(`/api/${syscode}`, params, data);
      case this.API_DELETE:
        return (params, data) => Api.delete(`/api/${syscode}`, params, data);
    }
    return new Error("동작실패");
  }
}

export default CreateTableHelper;
