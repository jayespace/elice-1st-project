export const headerTemplate = () => {
  // 토큰의 유무로 유저 로그인 판별
  const isLogIn = sessionStorage.getItem('token') ? true : false;

  // 유저 권한 판별
  const idAdmin = sessionStorage.getItem('role') === 'admin' ? true : false;

  let loginTemplate = '';
  if (isLogIn) {
    loginTemplate =
      '<li><a href="/">계정관리</a></li><li><a href="/api/logout">로그아웃</a></li>';
  } else {
    loginTemplate =
      '<li><a href="/login">로그인</a></li><li><a href="/register">회원가입</a></li>';
  }

  // let adminTemplate = '';

  // if (isAdmin) {
  //   adminTemplate = `
  //   `;
  // }

  return `
    <nav class="navbar is-fixed-top">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="../">
            <img src="../common/header/elice-rabbit.png" alt="Logo" />
          </a>
          <span class="navbar-burger burger" data-target="navbarMenu">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>

        <!-- NAVBAR -->
        <div id="navbarMenu" class="navbar-menu">
          <!-- 좌측 메뉴바 -->
          <div class="navbar-start">
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link"> 모든 상품 </a>
              <div class="navbar-dropdown">
                <a class="navbar-item"> 카테고리1 </a>
                <a class="navbar-item"> 카테고리2 </a>
                <a class="navbar-item"> 카테고리3 </a>
              </div>
            </div>
          </div>

          <!-- 우측 메뉴바 -->
          <div class="navbar-end">
            <a href="/login" class="navbar-item"> 로그인 </a>
            <a href="/register" class="navbar-item"> 회원가입 </a>
            <a class="navbar-item"> 장바구니 </a>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link"> 사용자 </a>
              <div class="navbar-dropdown">
                <a class="navbar-item"> 주문조회 </a>
                <hr class="navbar-divider" />
                <a class="navbar-item"> 회원정보관리 </a>
                <a class="navbar-item"> 관리자페이지 </a>
                <hr class="navbar-divider" />
                <a class="navbar-item">로그아웃</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;
};
