import * as Api from '../api.js'; //api.js에서 쉽게 Post, Get을 가져올 수 있어요.
// import { randomId } from '/useful-functions.js'; //useful-functions.js에서 기능 가져올 수 있다고 하네요.. 뭐 전 잘 안써요.

// 요소(element), input 혹은 상수 <== 요기요기요기 요기 밑에 처럼 Node, 즉 안드로이드 findViewById 처럼 변수 - 태그 를 연결합니다.
// const landingDiv = document.querySelector('#landingDiv');
// const greetingDiv = document.querySelector('#greetingDiv');
const list = document.querySelector(".product-list");

// addAllElements(); //addAllElements 실행한데요
// addAllEvents(); //addAllEvents 도 실행합니다.
getDataFromApi();
async function getDataFromApi() {
  // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
  const data = await Api.get('/api/products');
  const arr = data.products;
  console.log(data.products);
  console.log(data.products[0]._id);

  arr.map((a)=>{
      insertHTMLToList(a);
  });

  // addAllEvents();
}
addAllEvents();
// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
//   insertTextToLanding();
//   insertTextToGreeting();
}
// const child = document.querySelector(".product-list").children[0];
// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
// 더 설명드리면 addEventListener 를 쓰는 문법? 문장 들을 넣어주면 될꺼에요
function addAllEvents() {
}


/**************여기 밑에 함수(function)을 입력해주세요***************/
function insertHTMLToList(a){
  list.insertAdjacentHTML(
    'beforeend',
    `
      <div class="product" id="${a._id}">
        <div class="img">
          <img src="${a.image}" alt="상품이미지">
        </div>
        <div class="content">
          <h2 class="name" id="pname">${a.name}</h2>
          <p class="price" id="pprice">${a.price}원</p>
        </div>
      </div>
    `
  );

  var url;
  const id = document.getElementById(a._id);
  // (url= `/detail?id=${a._id}`
 
 
  id.querySelector('div').addEventListener('click',(url= `/detail?id=${a._id}` ,
  function(){
    // alert(a._id); //해당 id를 url에 붙여서 넘겨주고, 이를 받아오기...
    window.location.href = url;
  }
  ))
 
}

// function serialize(obj) {
//   var str = [];
//   for (var p in obj)
//     if (obj.hasOwnProperty(p)) {
//       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//     }
//   return str.join("&");
// }

function alertLandingText() {
  alert('n팀 쇼핑몰입니다. 안녕하세요.');
}

function alertGreetingText() {
  alert('n팀 쇼핑몰에 오신 것을 환영합니다');
}
