// 문자열+숫자로 이루어진 랜덤 5글자 반환
export const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

// 이메일 형식인지 확인 (true 혹은 false 반환)
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// 숫자에 쉼표를 추가함. (10000 -> 10,000)
export const addCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 13,000원, 2개 등의 문자열에서 쉼표, 글자 등 제외 후 숫자만 뺴냄
// 예시: 13,000원 -> 13000, 20,000개 -> 20000
export const convertToNumber = (string) => {
  return parseInt(string.replace(/(,|개|원)/g, ''));
};

// ms만큼 기다리게 함.
export const wait = (ms) => {
  return new Promise((r) => setTimeout(r, ms));
};


/**
 * Author: Park Sang Jun
 * created At: 2022-06-01
 * Img.src 에 사용할 수 있는 img String을 반환합니다.
 * @param {file} file files[0] in type="file"
 * @returns {Pomise} Base64 encoded ImageUrl
 */
export const insertImageFile = async (file) => {
  return new Promise((resolve, reject) => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async function (data) {
        const uploadImage = await data.target.result;
        resolve(uploadImage);
      };
      fileReader.readAsDataURL(file);
    }else{
      reject(new Error("이미지 파일이 없습니다."))
    }
  });
}
/**
 * Author: Park Sang Jun
 * created At: 2022-06-01
 * Dependency:  <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
 * DaumJibunApi 에서 우편번호와 주소 정보를 가져옵니다.
 * @returns {Promise} {zonecode, address} zoncode는 우편번호, adress주소 정보와 건물명을 담긴 데이터입니다. 
 */ 

export const searchAddressByDaumPost = () => {
  return new Promise((resole) => {
    new daum.Postcode({
      oncomplete: function (data) {
        let addr = ""; // 주소 변수

        let buildingName = data.buildingName ? ` (${data.buildingName})` : "";
        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === "R") {
          // 사용자가 도로명 주소를 선택했을 경우
          addr = `${data.roadAddress}${buildingName}`;
        } else {
          // 사용자가 지번 주소를 선택했을 경우(J)
          addr = `${data.jibunAddress}${buildingName}`;
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        const zonecode = data.zonecode;
        const address = addr;
        // 커서를 상세주소 필드로 이동한다.
        resole({ zonecode, address });
      },
    }).open();
  });
}

/**
 * The MIT License (MIT)
 * Copyright (c) 2022 Jeremy Thomas
 * CopyLink: https://bulma.io/documentation/components/modal/
 * dependency : <link rel="stylesheet"href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"/>
 */ 
export const activeModalFunction = () => {
  document.addEventListener("DOMContentLoaded", () => {
    function openModal($el) {
      $el.classList.add("is-active");
    }
    function closeModal($el) {
      $el.classList.remove("is-active");
    }
    function closeAllModals() {
      (document.querySelectorAll(".modal") || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
    (document.querySelectorAll(".js-modal-trigger") || []).forEach(
      ($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener("click", () => {
          openModal($target);
        });
      }
    );
    (
      document.querySelectorAll(
        ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button, .cancel"
      ) || []
    ).forEach(($close) => {
      const $target = $close.closest(".modal");

      $close.addEventListener("click", () => {
        closeModal($target);
      });
    });
    document.addEventListener("keydown", (event) => {
      const e = event || window.event;
      if (e.keyCode === 27) {
        closeAllModals();
      }
    });
  });
};
