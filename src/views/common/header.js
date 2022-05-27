export const headerTemplate = () => {
  // 토큰의 유무로 유저 로그인 판별
  const userIsLogIn = sessionStorage.getItem('token') ? true : false;
  let template = '';
  if (userIsLogIn) {
    template =
      '<li><a href="/">계정관리</a></li><li><a href="/api/logout">로그아웃</a></li>';
  } else {
    template =
      '<li><a href="/login">로그인</a></li><li><a href="/register">회원가입</a></li>';
  }

  return `
    <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="container mt-3">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="/elice-rabbit.png" width="30" height="30" />
          <span class="has-text-link">쇼핑-n팀</span>
        </a>

        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

        <div class="navbar-end breadcrumb my-auto" aria-label="breadcrumbs">
          <ul id="navbar">
            <li><a href="/products">모든상품</a></li>
            ${template}
            <li>
              <a href="#cart" aria-current="page">
                <span class="icon">
                  <i class="fas fa-cart-shopping"></i>
                </span>
                <span>카트</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  `;
};
