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
