function searchByDaumPost() {
    console.log("open DaumJibunAPI");
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            // 주요한 data
            // data.zoncode 우편번호
            // data.roadAddress/data.jibunAddress 지번
            // {data.buildingName} 건물이름
            
            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = `${data.roadAddress} (${data.buildingName})`;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = `${data.jibunAddress} (${data.buildingName})`;
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('postalCodeInput').value = data.zonecode;
            document.getElementById("address1Input").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("address2Input").focus();
        }
    }).open();
}

function insertImageFile(file) {
    let input = file.target
    //이미지 파일 유효성 검사
	if(input.files && input.files[0]) {
		fileReader = new FileReader();
		fileReader.onload = function (data) {
            const img = document.querySelector('#profile-image');
		    img.src = data.target.result;
            img.style.width = "100%"
            img.style.height = "100%"

		}
        //readAsDataURL 진행후 fileReader의 onload가 진행됩니다.
		fileReader.readAsDataURL(input.files[0]); 

	}
}
document.querySelector('#imageInput')
    .addEventListener('change', insertImageFile);
						

document.querySelector("#searchAddressButton")
    .addEventListener('click', searchByDaumPost);
