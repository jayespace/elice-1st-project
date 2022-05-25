//Bulma 에서 제공하는 Modal 활성화 코드
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      const e = event || window.event;
  
      if (e.keyCode === 27) { // Escape key
        closeAllModals();
      }
    });
  });
//다음지번 API를 활용한 함수 입니다.
function searchByDaumPost() {
    console.log("open DaumJibunAPI");
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            let addr = ''; // 주소 변수
            let extraAddr = ''; // 참고항목 변수

            // 주요한 data
            // data.zoncode 우편번호
            // data.roadAddress/data.jibunAddress 지번
            // {data.buildingName} 건물이름
            
            //빌딩 이름이 없을시 '' 값을 반환합니다.
            let buildingName = data.buildingName ? ` (${data.buildingName})`:''; 
            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = `${data.roadAddress}${buildingName}`;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = `${data.jibunAddress}${buildingName}`;
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('postalCodeInput').value = data.zonecode;
            document.getElementById("address1Input").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("address2Input").focus();
        }
    }).open();
}

// 파일 업로드 함수 입니다.
function insertImageFile(file) {
    let input = file.target
    //이미지 파일 유효성 검사
	if(input.files && input.files[0]) {
		fileReader = new FileReader();
		fileReader.onload = function (data) {
            //
            const img = document.querySelector('#profile-image');
		    img.src = data.target.result;
            img.style.width = "100%"
            img.style.height = "100%"

		}
        //readAsDataURL 데이터를 읽습니다. 그리고 fileReader.onload가 진행됩니다.
		fileReader.readAsDataURL(input.files[0]); 

	}
}

function checkForm(){

    //비밀번호를 검사합니다.
    function checkPassword(){
        const password = document.querySelector('#password').value;
        const passwordConfirm = document.querySelector('#passwordConfirm').value;
        if(password && passwordConfirm){
            if(password === passwordConfirm){
                return password
            }
        }
        return false;
    }

    //주소를 검사합니다.
    function checkAddress(){
        const postalCodeInput = document
            .querySelector('#postalCodeInput').value;
        const address1Input = document
            .querySelector('#address1Input').value;
        const address2Input = document
            .querySelector('#address2Input').value;

        if(postalCodeInput && address1Input){
            if(address2Input){
                return [postalCodeInput, address1Input, address2Input];
            }
        }

        return false;
    }

    const password = checkPassword();
    const address = checkAddress();
    if(password && address){
        console.log(password, address);
    }
    else{
        alert('입력해주세요');
    }
}



document.querySelector('#imageInput')
    .addEventListener('change', insertImageFile);
						

document.querySelector("#searchAddressButton")
    .addEventListener('click', searchByDaumPost);

document.querySelector('#saveButton')
    .addEventListener('click', checkForm);

