import { headerTemplate } from './header/header.js';
import { footerTemplate } from './footer/footer.js';
import { adminTemplate } from './header/admin.js';
const $ = (selector) => document.querySelector(selector);

// header, footer 요소
const headerEl = $('#header');
const footerEl = $('#footer');

// head 요소
const headEl = $('head');

addAllElements();
if ($('.logout')) {
  userLogout();
  isUserAdmin();
}

// header, footer 요소를 추가하는 함수
async function addAllElements() {
  insertHeaderEl();
  insertFooterEl();
}

function insertHeaderEl() {
  headEl.insertAdjacentHTML(
    'beforeend',
    `
    <link rel="stylesheet" href="../common/header/header.css" />
    <script defer type="text/javascript" src="../common/header/navbar.js"></script>
    `
  );
  headerEl.insertAdjacentHTML('afterbegin', headerTemplate());
}

function insertFooterEl() {
  footerEl.insertAdjacentHTML('afterbegin', footerTemplate);
}

// 로그아웃
function userLogout() {
  const logoutEl = $('.logout');
  const handleLogout = () => {
    alert('로그아웃 되었습니다. ');
    sessionStorage.clear();
    window.location.href = '/';
  };
  logoutEl.addEventListener('click', handleLogout);
}

// 관리자 페이지
function isUserAdmin() {
  if (sessionStorage.getItem('role') === 'admin') {
    $('.admin').insertAdjacentHTML('beforebegin', adminTemplate);
  }
}
