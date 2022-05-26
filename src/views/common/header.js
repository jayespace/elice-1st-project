export const headerTemplate = () => {
  // 토큰의 유무로 유저 로그인 판별
  const userIsLogIn = sessionStorage.getItem('token') ? true : false;
  let template = '';
  if (userIsLogIn) {
    template =
      '<li class="m_login"><a href="/">유저정보</a></li><li class="m_signup"><a href="/">로그아웃</a></li>';
  } else {
    template =
      '<li class="m_login"><a href="/login">로그인</a></li><li class="m_signup"><a href="/register">회원가입</a></li>';
  }

  return `
  <!-- 메뉴(모바일) -->
  <div class="m_menu_fixed"></div>
  <div class="m_menu_wrap">
    <div class="m_menu_top">
      <div class="m_menu_close">X</div>
    </div>
    <div class="m_menu_bottom">
      <div class="m_join">
        <ul>
        ${template}
        </ul>
      </div>
  
      <div class="m_menu">
        <ul>
          <li><a href="/">Home</a></li>
          <li>
            <a href="/">모든 상품</a>
            <ul class="shop_submenu">
              <li><a href="/">서브메뉴</a></li>
              <li><a href="/">서브메뉴</a></li>
              <li><a href="/">서브메뉴</a></li>
            </ul>
          </li>
          <li class="m_menu-em"><a href="#">프로젝트 소개</a></li>
          <li><a href="/">이벤트</a></li>
        </ul>
      </div>
    </div>
  </div>
  
  <!-- 회원가입, 로그인 -->
  <div class="menu_top">
    <ul>
    ${template}
    </ul>
  </div>
  
  <!-- Menu Bottom :: 로고, 메뉴, 검색, 장바구니 -->
  <div class="menu_bottom">
    <div class="logo">
      <a href="/"><img src="../common/logo.png" alt="logo image" /></a>
    </div>
  
    <ul class="menu">
      <li class="menu1"><a href="#">모든 상품</a></li>
      <li>
        <a href="#">프로젝트 소개<em></em></a>
      </li>
      <li><a href="#">이벤트</a></li>
    </ul>
  
    <div class="cart_btn">
      <a href="#">
        <img
          src="../common/shopping_cart_icon.png"
          alt="shopping cart image"
        />
        <div class="cart_tooltip">장바구니</div>
      </a>
    </div>
  
    <!-- 모바일 메뉴바 -->
    <div class="m_menubar">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  
  <!-- Sub Menu :: 모든상품 서브메뉴 -->
  <div class="sub_menu_wrap">
    <ul class="sub_menu">
      <li><a href="#">서브메뉴</a></li>
    </ul>
  </div>
  
    `;
};
