import { headerTemplate } from './header.js';
import { footerTemplate } from './footer.js';
const $ = (selector) => document.querySelector(selector);

// header, footer 요소
const headerEl = $('#header');
const footerEl = $('#footer');

addAllElements();

// html에 header와 footer 요소를 추가하는 함수
async function addAllElements() {
  insertHeaderEl();
  insertFooterEl();
}

function insertHeaderEl() {
  headerEl.insertAdjacentHTML('beforeend', headerTemplate);
}

function insertFooterEl() {
  footerEl.insertAdjacentHTML('beforeend', footerTemplate);
}
