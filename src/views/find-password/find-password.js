import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';

// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#emailInput');
const submitButton = document.querySelector('#submitButton');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);

  if (!isEmailValid) {
    return alert('이메일 형태가 맞는지 확인해 주세요.');
  }

  // 로그인 api 요청
  try {
    const data = { email };
    const result = await Api.post('/api/user/reset-password', data);
    // console.log(result);

    // 비밀번호 찾기 성공 알림
    alert(`임시 비밀번호가 발급되었습니다. 이메일을 확인해주세요.`);

    // 기본 페이지로 이동
    // window.location.href = '/';
  } catch (err) {
    // console.error(err.stack);
    alert(`${err.message}`);
  }
}
