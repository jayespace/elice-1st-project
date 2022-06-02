import { headerTemplate } from './header/header.js';
import { footerTemplate } from './footer/footer.js';
const $ = (selector) => document.querySelector(selector);

// header, footer 요소
const headerEl = $('#header');
const footerEl = $('#footer');

// head 요소
const headEl = $('head');

addAllElements();

// header, footer 요소를 추가하는 함수
async function addAllElements() {
  insertHeaderEl();
  insertFooterEl();
}
async function insertHeaderEl() {
  headEl.insertAdjacentHTML(
    'beforeend',
    `
    <link rel="stylesheet" href="../common/header/header.css" />
    <script defer type="text/javascript" src="../common/header/navbar.js"></script>
    `
  );
  headerEl.insertAdjacentHTML('afterbegin', await headerTemplate());
}
function insertFooterEl() {
  footerEl.insertAdjacentHTML('afterbegin', footerTemplate);
}

// 로그아웃
const logoutEl = $('.logout');

if ($('.logout')) {
  userLogout();
}

function userLogout() {
  logoutEl.addEventListener('click', () => {
    alert('로그아웃 되었습니다. ');
    sessionStorage.clear();
    window.location.href = '/';
  });
}
