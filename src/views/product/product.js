async function getAllProducts() {
  const response = await fetch('http://127.0.0.1:5000/api/products/');
  const allProducts = await response.json();

  const productListEl = document.querySelector('.product');

  let products = allProducts.products;

  products.map((product) => productListEl.append(`${product.name}   `));
}

getAllProducts();
