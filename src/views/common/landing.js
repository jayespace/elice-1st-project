import { headerTemplate } from './header.js';
import { footerTemplate } from './footer.js';
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
function insertHeaderEl() {
  headEl.insertAdjacentHTML(
    'beforeend',
    `<link rel="stylesheet" href="../common/common.css"/>
    <script src="../common/common.js" defer></script>
    `
  );
  headerEl.insertAdjacentHTML('afterbegin', headerTemplate());
}
function insertFooterEl() {
  footerEl.insertAdjacentHTML('afterbegin', footerTemplate);
}
