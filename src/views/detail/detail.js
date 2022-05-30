import * as Api from '../api.js'; //api.js에서 쉽게 Post, Get을 가져올 수 있어요.

const url = new URL(window.location.href);
const id = url.searchParams.get("id");
const detail = document.querySelector(".product-detail");
console.log(id);

addAllElements(); //addAllElements 실행한데요
addAllEvents(); //addAllEvents 도 실행합니다.
getDataFromApi();

const name = document.querySelector(".name");
const price = document.querySelector(".price");
const briefDesc = document.querySelector(".briefDesc");
const fullDesc = document.querySelector(".fullDesc");
const total = document.querySelector(".total");
var value = document.querySelector('.select-qty');
//     alert(value.options[value.selectedIndex].text);
var get = new Array();
async function getDataFromApi() {
  // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
    const data = await Api.get('/api/products');
    const arr = data.products;

    get = arr.find(a=>a._id === id);

    console.log(get.name);
    insertHTMLToDetail(get);
    name.innerText = get.name;
    price.innerText = get.price +" 원";
    briefDesc.innerText = get.briefDesc;
    fullDesc.innerText = get.fullDesc;
    total.innerText = get.price * Number(value.options[value.selectedIndex].text);
    // price.innerText = get.name;

//   addAllEvents();
}
addAllEvents();
async function addAllElements() {
  
}
function addAllEvents() {
}
// let a = [];
const addbtn = document.querySelector('.buttons-container');
addbtn.addEventListener("click",()=>{
    // a.push(JSON.stringify(get));
    let getItem = window.localStorage.getItem("cart");
    let objectId = get._id;
    let a =JSON.stringify(get);

    console.log(getItem);

    if(getItem === null){
        getItem = [];
    } 
    else{

        // getItem = getItem.split("||");
        var result = getItem.filter((item1, idx1)=>{
            return arr.findIndex((item2, idx2)=>{
                return item1.id == item2.id;
            }) == idx1;
        });
       
    }
    getItem.push(a);
    
    
    window.localStorage.setItem("cart",getItem.join("||"));
    

    console.log(getItem);
    // getItem.push(JSON.stringify(get));

    
    
   
})
/**************여기 밑에 함수(function)을 입력해주세요***************/
function insertHTMLToDetail(a){
  detail.insertAdjacentHTML(
    'afterbegin',
    `
    <div class="product-image">
        <img id="productImageTag" src="${a.image}" alt="상품이미지" />
    </div>
    `
  );
}

//onchage함수....