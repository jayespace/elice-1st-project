import { addCommas } from '/useful-functions.js';
const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem('cart'));
  },
};
function App() {
  // 상태
  this.cart = [];

  // 스토리지에서 카트 리스트 불러오기
  this.init = () => {
    if (store.getLocalStorage().length > 1) {
      this.cart = store.getLocalStorage();
    }
    render();
  };

  const counts = $('#productsTitle');
  const totalPrices = $('#productsTotal');
  const orderTotal = $('#orderTotal');
  const delivery = $('#deliveryFee');

  // 카트 리스트 목록
  const render = () => {
    const cartLists = this.cart
      .map((item, index) => {
        return `
          <div class="box">
            <li data-item-id="${index}" class="cart-list-item media">
              <div class="media-left">
              <input type="checkbox" class="cart-item" ${item.cart}>
                <figure class="image is-64x64"><img alt="Image" src="${
                  item.image
                }" /></figure>
              </div>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong> ${item.name} </strong> 
                    <small> ${addCommas(item.price)} 원 </small>
                  </p>
                </div>
                <nav class="level">
                <button class="decrease-item"> - </button>
                <span class="menu-count">${item.count}</span>
                <button class="increase-item"> + </button>
                <button class="delete-item"> 삭제 </button>
                </nav>
              </div>
            </li>
          </div>
        `;
      })
      .join('');
    $('#cart-list').innerHTML = cartLists;

    let itemCounts = 0;
    let itemPrices = 0;
    let orderedItem = '';
    let deliveryFee = 0;
    this.cart.map((item) => {
      if (item.cart === 'checked') {
        itemCounts += item.count;
        itemPrices += item.price * item.count;
        console.log(itemPrices);
        orderedItem += `${item.name} / ${item.count}개<br />`;
        deliveryFee = 3000;
      }
      counts.innerHTML = orderedItem;
      totalPrices.innerText = `${addCommas(itemPrices)} 원`;
      delivery.innerText = `${addCommas(deliveryFee)} 원`;
      orderTotal.innerText = `${addCommas(itemPrices + deliveryFee)} 원`;
    });
  };

  // 상품 상태 변경
  $('#cart-list').addEventListener('click', (e) => {
    const itemId = e.target.closest('li').dataset.itemId;

    // 상품 개수 증가
    if (e.target.classList.contains('increase-item')) {
      this.cart[itemId].count++;
      store.setLocalStorage(this.cart);
      render();
    }

    // 상품 개수 감소
    if (e.target.classList.contains('decrease-item')) {
      if (this.cart[itemId].count > 2) {
        this.cart[itemId].count--;
      } else {
        this.cart[itemId].count = 1;
      }
      store.setLocalStorage(this.cart);
      render();
    }

    // 상품 삭제
    if (e.target.classList.contains('delete-item')) {
      if (confirm('삭제하시겠습니까?')) {
        this.cart.splice(itemId, 1);
        e.target.closest('li').remove();
        store.setLocalStorage(this.cart);
        render();
      }
    }

    // 상품 선택
    if (e.target.classList.contains('cart-item')) {
      if (this.cart[itemId].cart === 'checked') {
        this.cart[itemId].cart = '';
      } else {
        this.cart[itemId].cart = 'checked';
      }
      store.setLocalStorage(this.cart);
      render();
    }
  });

  // 상품 전체 삭제
  const removeAllEl = $('#remove-all');
  removeAllEl.addEventListener('click', () => {
    alert('장바구니에 있는 모든 상품을 삭제합니다.');
    this.cart = [];
    localStorage.clear();
    render();
  });

  // 상품 선택 삭제
  const removePartialEl = $('#remove-partial');
  removePartialEl.addEventListener('click', () => {
    alert('선택한 상품을 삭제합니다.');
    this.cart = this.cart.filter((item) => item.cart !== 'checked');
    store.setLocalStorage(this.cart);
    render();
  });
}

const app = new App();
app.init();
