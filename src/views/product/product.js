import * as Api from '/api.js'; //api.js에서 쉽게 Post, Get을 가져올 수 있어요.
import { randomId } from '/useful-functions.js'; //useful-functions.js에서 기능 가져올 수 있다고 하네요.. 뭐 전 잘 안써요.

// 요소(element), input 혹은 상수 <== 요기요기요기 요기 밑에 처럼 Node, 즉 안드로이드 findViewById 처럼 변수 - 태그 를 연결합니다.
// const landingDiv = document.querySelector('#landingDiv');
// const greetingDiv = document.querySelector('#greetingDiv');

// addAllElements(); //addAllElements 실행한데요
// addAllEvents(); //addAllEvents 도 실행합니다.
getDataFromApi();

async function getDataFromApi() {
  // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
  // const data = await Api.get('/api/products');
  const id = 
  '628ea213a0cbc4e934743e8f';
  const data = await Api.get('/api/products');
  // const length = data.products.length;
  // console.log(length);
  console.log(data.products);
  console.log(data.products[0]);
  // const random = randomId();

  // document.write({data});
  console.log({ data });
  // console.log({ random });
}
// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
//   insertTextToLanding();
//   insertTextToGreeting();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
// 더 설명드리면 addEventListener 를 쓰는 문법? 문장 들을 넣어주면 될꺼에요
function addAllEvents() {
//   landingDiv.addEventListener('click', alertLandingText);
//   greetingDiv.addEventListener('click', alertGreetingText);
}


/**************여기 밑에 함수(function)을 입력해주세요***************/

function insertTextToLanding() {
  landingDiv.insertAdjacentHTML(
    'beforeend',
    `
      <h2>n팀 쇼핑몰의 랜딩 페이지입니다. 자바스크립트 파일에서 삽입되었습니다.</h2>
    `
  );
}

function insertTextToGreeting() {
  greetingDiv.insertAdjacentHTML(
    'beforeend',
    `
      <h1>반갑습니다! 자바스크립트 파일에서 삽입되었습니다.</h1>
    `
  );
}

function alertLandingText() {
  alert('n팀 쇼핑몰입니다. 안녕하세요.');
}

function alertGreetingText() {
  alert('n팀 쇼핑몰에 오신 것을 환영합니다');
}
//일단 시작으로는
//Api.get('/api/products') 를 통해 들어오는 데이터를 확인해보세요
// console.log(data); 를 입력하면 확인할 수 있어요.

//지금 프로젝트는 sessionStorage를 사용해요

//정말정말 모르시겠다면 1. front-merge 구동시키고 2. 로그인하고  3. 크롬 F12 => console 에서  sessionStorage를 입력해보세요 그럼 값이 보일겁니다.
