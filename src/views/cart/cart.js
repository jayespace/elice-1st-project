import * as Api from '/api.js';

const $ = (selector) => document.querySelector(selector);

// 스토리지
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

  // 카트 리스트 목록
  const render = () => {
    const cartLists = this.cart
      .map((item, index) => {
        if (item.cart === true) {
          const checked = 'checked';
        }
        return `
          <li data-item-id="${index}" class="cart-list-item">
            <label class="checkbox">
              <input type="checkbox" class="cart-item" ${item.cart}>
            </label>
            ${item.name}
            <button class="decrease-item"> - </button>
            <span class="menu-count">${item.count}</span>
            <button class="increase-item"> + </button>
            <button class="delete-item"> 삭제 </button>
          </li>
        `;
      })
      .join('');
    $('#cart-list').innerHTML = cartLists;

    const counts = $('#item-counts');
    const prices = $('#item-prices');
    let itemCounts = 0;
    let itemPrices = 0;
    this.cart.map((item) => {
      if ((item.cart = 'checked')) {
        itemCounts += item.count;
        itemPrices += item.price * item.count;
      }
      counts.innerText = `상품수: ${itemCounts} 개`;
      prices.innerText = `총금액: ${itemPrices} 원`;
    });
  };

  // 상품 개수 수정
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
    // // 상품 선택
    // if (e.target.classList.contains('cart-item')) {
    //   console.log(this.cart[itemId].cart);
    //   this.cart[itemId].cart =
    //     this.cart[itemId].cart === 'checked' ? '' : 'checked';
    //   store.setLocalStorage(this.cart);
    //   render();
    // }
  });
}

const app = new App();
app.init();
