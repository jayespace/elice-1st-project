<<<<<<< HEAD
=======
import { addCommas } from '/useful-functions.js';
>>>>>>> feature/cart
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

<<<<<<< HEAD
  // 카트 리스트 목록
  const counts = $('#productsTitle');
  const prices = $('#productsTotal');
  const orderTotal = $('#orderTotal');
=======
  const counts = $('#productsTitle');
  const prices = $('#productsTotal');
  const orderTotal = $('#orderTotal');
  const delivery = $('#deliveryFee');

  // 카트 리스트 목록
>>>>>>> feature/cart
  const render = () => {
    const cartLists = this.cart
      .map((item, index) => {
        return `
          <div class="box">
            <li data-item-id="${index}" class="cart-list-item media">
              <div class="media-left">
              <input type="checkbox" class="cart-item" ${item.cart}>
<<<<<<< HEAD
                <figure class="image is-64x64"><img alt="Image" src="${item.image}" /></figure>
=======
                <figure class="image is-64x64"><img alt="Image" src="${
                  item.image
                }" /></figure>
>>>>>>> feature/cart
              </div>
              <div class="media-content">
                <div class="content">
                  <p>
<<<<<<< HEAD
                    <strong> ${item.name} </strong> <small> ${item.price} 원 </small>
=======
                    <strong> ${item.name} </strong> 
                    <small> ${addCommas(item.price)} 원 </small>
>>>>>>> feature/cart
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
<<<<<<< HEAD
=======
    let orderedItem = '';
    let deliveryFee = 0;
>>>>>>> feature/cart
    this.cart.map((item) => {
      if (item.cart === 'checked') {
        itemCounts += item.count;
        itemPrices += item.price * item.count;
<<<<<<< HEAD
      }
      counts.innerText = `상품수: ${itemCounts} 개`;
      prices.innerText = `${itemPrices} 원`;
      orderTotal.innerText = `${itemPrices + 3000} 원`;
=======
        orderedItem += `${item.name} / ${item.count}개<br />`;
        deliveryFee = 3000;
      }
      counts.innerHTML = orderedItem;
      prices.innerText = `${addCommas(itemPrices)} 원`;
      delivery.innerText = `${addCommas(deliveryFee)} 원`;
      orderTotal.innerText = `${addCommas(itemPrices + deliveryFee)} 원`;
>>>>>>> feature/cart
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
<<<<<<< HEAD
    console.log(this.cart[itemId].cart);
=======
>>>>>>> feature/cart
    if (e.target.classList.contains('cart-item')) {
      if (this.cart[itemId].cart === 'checked') {
        this.cart[itemId].cart = '';
      } else {
        this.cart[itemId].cart = 'checked';
      }
      store.setLocalStorage(this.cart);
      render();
    }
<<<<<<< HEAD

    // 상품 전체 선택
    const selectAll = $('#select-all');
    const handleSelectAll = (e) => {
      // console.log(e.target);
      if (selectAll.checked) {
      }
    };
    selectAll.addEventListener('click', handleSelectAll());
  });
=======
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

  // 체크한 상품이 없을 시 결제페이지로 넘어가지 않도록 함
  // const purchaseBtn = $('#checkoutButton');
  // const isEmpty = this.cart.filter((item) => item.cart === 'checked');
  // purchaseBtn.addEventListener('click', () => {
  //   if (isEmpty.length === 0) {
  //     window.location.href = '/shippingpoint';
  //   } else {
  //     alert('구매할 상품을 선택해주세요. ');
  //   }
  // });
>>>>>>> feature/cart
}

const app = new App();
app.init();
