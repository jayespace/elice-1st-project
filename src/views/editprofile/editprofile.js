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
            // data.buildingName 건물이름
            
            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress + data.buildingName;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress+ data.buildingName;
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('postalCodeInput').value = data.zonecode;
            document.getElementById("address1Input").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("address2Input").focus();
        }
    }).open();
}
function loadFile(input) {
    var file = input.files[0];	//선택된 파일 가져오기

    //미리 만들어 놓은 div에 text(파일 이름) 추가
    var name = document.getElementById('fileName');
    name.textContent = file.name;

  	//새로운 이미지 div 추가
    var newImage = document.createElement("img");
    newImage.setAttribute("class", 'img');

    //이미지 source 가져오기
    newImage.src = URL.createObjectURL(file);   

    newImage.style.width = "70%";
    newImage.style.height = "70%";
    newImage.style.visibility = "hidden";   //버튼을 누르기 전까지는 이미지를 숨긴다
    newImage.style.objectFit = "contain";

    //이미지를 image-show div에 추가
    var container = document.getElementById('image-show');
    container.appendChild(newImage);
};

// var submit = document.getElementById('submitButton');
// submit.onclick = showImage;     //Submit 버튼 클릭시 이미지 보여주기

// function showImage() {
//     var newImage = document.getElementById('image-show').lastElementChild;
  
//     //이미지는 화면에 나타나고
//     newImage.style.visibility = "visible";
  
//     //이미지 업로드 버튼은 숨겨진다
//     document.getElementById('image-upload').style.visibility = 'hidden';

//     document.getElementById('fileName').textContent = null;     //기존 파일 이름 지우기
// }


document.querySelector("#searchAddressButton")
    .addEventListener('click', searchByDaumPost);
document.querySelector("#image-button")
    .addEventListener('click',loadFile);