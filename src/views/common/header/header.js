import * as Api from '/api.js';

const getCategoryList = async () => {
  // 카테고리 분류
  try {
    const categories = await Api.get(`/api/categories`);
    console.log(categories);
    return categories
      .map(
        ({ _id, name }) =>
          `<a href='?category=${name}'class="navbar-item"> ${name} </a>`
      )
      .join('');
  } catch (e) {
    console.error('카테고리 Nav 목록 :', e.message);
  }
};

export const headerTemplate = async () => {
  // 토큰의 유무로 유저 로그인 판별
  const isLogIn = sessionStorage.getItem('token') ? true : false;
  const username = sessionStorage.getItem('username');

  let loginTemplate = '';
  if (isLogIn) {
    loginTemplate = `<div class="navbar-item has-dropdown is-hoverable">
                      <a class="navbar-link"> ${username} </a>
                      <div class="navbar-dropdown">
                        <a href="/#"class="navbar-item"> 주문조회 </a>
                        <hr class="navbar-divider" />
                        <a href="/editprofile" class="navbar-item"> 회원정보관리 </a>
                        <hr class="navbar-divider admin" />
                        <a class="navbar-item logout">로그아웃</a>
                      </div>
                    </div>`;
  } else {
    loginTemplate = `<a href="/login" class="navbar-item"> 로그인 </a>
                    <a href="/register" class="navbar-item"> 회원가입 </a>`;
  }

  return `
    <nav class="navbar is-fixed-top">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="../">
            <img src="../common/header/elice-rabbit.png" alt="Logo" />
          </a>
          <a role="button" class="navbar-burger" data-target="navMenu" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
        </div>
        <div id="navMenu" class="navbar-menu">
          <!-- 좌측 메뉴바 -->
          <div class="navbar-start">
            <div class="navbar-item has-dropdown is-hoverable">
              <a href="/products" class="navbar-link"> 모든 상품 </a>
              <div class="navbar-dropdown">
                ${await getCategoryList()}
              </div>
            </div>
          </div>

          <!-- 우측 메뉴바 -->
          <div class="navbar-end">
          ${loginTemplate}
            <a href="/cart" class="navbar-item"> 장바구니 </a>
          </div>
        </div>
      </div>
    </nav>
  `;
};
