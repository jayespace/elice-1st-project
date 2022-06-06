import * as Api from '/api.js';

const getCategoryList = async () => {
  // 카테고리 분류
  try {
    const categories = await Api.get(`/api/categories`);
    return categories
      .map(
        ({ _id, name }) =>
          `<a href='/products?category=${name}'class="navbar-item is-size-6"> ${name} </a>`
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
  const isAdmin = sessionStorage.getItem('role') === 'admin' ? true : false;
  const userImage = sessionStorage.getItem('image');
  let adminTemplate = '';
  let userTemplate = '';
  if (isAdmin) {
    adminTemplate = `<a href="/account" class="navbar-item is-size-6"> 관리자페이지 </a>`;
  }
  if(!isAdmin){
    userTemplate = `<a href="/orders"class="navbar-item"> 주문조회 </a>`;
  }
  let loginTemplate = '';
  if (isLogIn) {
    loginTemplate = `<div class="navbar-item has-dropdown is-hoverable">
                      <a class="navbar-link">
                      <figure class="image is-24x24">
                        <img class="is-rounded is-size-5" src="${userImage}">
                      </figure>
                      <span class="is-size-5">${username}</span>
                      </a>
                      <div class="navbar-dropdown">
                        ${userTemplate}
                        <hr class="navbar-divider" />
                        <a href="/editprofile" class="navbar-item is-size-6"> 회원정보관리 </a>
                        ${adminTemplate}
                        <hr class="navbar-divider admin" />
                        <a class="navbar-item logout is-size-6" onclick="alert('로그아웃 되었습니다.');sessionStorage.clear();window.location.href='/';">로그아웃</a>
                      </div>
                    </div>`;
  } else {
    loginTemplate = `<a href="/login" class="navbar-item is-size-5"> 로그인 </a>
                    <a href="/register" class="navbar-item is-size-5"> 회원가입 </a>`;
  }

  return `
    <nav class="navbar is-fixed-top">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="../">
            <img src="../common/paw.png" alt="Logo" />
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
              <a href="/products" class="navbar-link is-size-5"> 모든 상품 </a>
              <div class="navbar-dropdown">
                ${await getCategoryList()}
              </div>
            </div>
            <a href="/brand-info" class="navbar-item is-size-5"> 프로젝트 소개 </a>
          </div>

          <!-- 우측 메뉴바 -->
          <div class="navbar-end">
          ${loginTemplate}
            <a href="/cart" class="navbar-item is-size-5"> 장바구니 </a>
          </div>
        </div>
      </div>
    </nav>
  `;
};
