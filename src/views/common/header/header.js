import * as Api from '/api.js';

const getCategoryList = async () => {
  // 카테고리 분류
  const category = await Api.get(`/api/products`);
};

export const headerTemplate = () => {
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
                <a class="navbar-item"> 카테고리1 </a>
                <a class="navbar-item"> 카테고리2 </a>
                <a class="navbar-item"> 카테고리3 </a>
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
