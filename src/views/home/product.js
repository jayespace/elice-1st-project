import * as Api from '../api.js';

const list = document.querySelector('.product-list');

async function getProducts() {
  const data = await Api.get('/api/products');
  const products = data.products;

  const productList = products
    .map((item) => {
      return `
        <div class="product" id="${item._id}">
            <div class="img">
                <img src="${item.image}" alt="상품이미지">
            </div>
        </div>
    `;
    })
    .slice(0, 8)
    .join('');
  list.insertAdjacentHTML('beforeend', productList);
}

getProducts();
