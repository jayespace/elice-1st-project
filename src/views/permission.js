export function checkToken() {
  //토큰이 없다면 로그인 페이지로 이동
  if (!sessionStorage.getItem("token")) {
    const { pathname, search } = window.location;
    window.location.replace(`/login?previouspage=${pathname + search}`);
  }
}

export function checkAdmin() {
  //토큰이 없다면 로그인 페이지로 이동
  if (sessionStorage.getItem("role") !== "admin") {
    const { pathname, search } = window.location;
    window.location.replace(`/login?previouspage=${pathname + search}`);
  }
}

export function redirectMain() {
    //토큰이 없다면 로그인 페이지로 이동
 
      const { pathname, search } = window.location;
      window.location.replace(`/login?previouspage=${pathname + search}`);
    
  }
  
