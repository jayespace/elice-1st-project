# TEAM12 - 쇼핑몰 웹 서비스 🐈

제품들을 조회하고, 장바구니에 추가하고, 또 주문을 할 수 있는 쇼핑몰 웹 서비스 제작 프로젝트입니다. <br />
귀여움으로 힐링이 되는 **고양이 용품**을 주제로 제작하였습니다. 

### 🐱 핵심 기능

* 회원가입, 로그인, 회원정보 수정 등 **유저 정보 관련 CRUD** 
* **제품 목록**을 조회 및, **제품 상세 정보**를 조회
* 장바구니에 제품을 추가할 수 있으며, **장바구니에서 CRUD** 작업
* 장바구니는 서버 DB가 아닌, 프론트 단에서 저장 및 관리
* 장바구니에서 주문을 진행하며, **주문 완료 후 조회 및 삭제** 가능

### 🐱 추가 및 개선된 기능
* 랜덤 비밀번호 초기화 **이메일 발송** 기능
* 시스템 코드 관리자 페이지
* 카카오 **소셜 로그인** 기능
* 유저 프로필 이미지 표시 기능
* 주문시 재고 반영 기능
* 주문 상태 Status 관리 기능

<br>

### 🐱 Demo

|  사용자 시나리오                                                                           |    관리자 시나리오            |
|:--------------------------------------------------------------------------------------:|:-----------------------:|
| ![](https://user-images.githubusercontent.com/101157141/176214307-5c872ff0-88b7-45a8-8a60-1efc832bf87f.gif) |![](https://user-images.githubusercontent.com/101157141/176214242-fbd728ba-d4f5-47ce-9fba-f95c607753b2.gif) |


### 🐱 프로젝트 자료
|  Flow Chart                                                                           |    최종 발표 PPT           |
|:--------------------------------------------------------------------------------------:|:-----------------------:|
| ![](https://user-images.githubusercontent.com/102934821/234160415-72cf54e6-8d0f-4a47-836e-d26fc381651e.png)|![](https://user-images.githubusercontent.com/102934821/234160422-7deaa5dd-7f3f-4826-ba76-627ba1efafd2.png) |
| API TestCase도 확인해 보실 수 있습니다<br>[API TestCase](https://docs.google.com/spreadsheets/d/1vFKmgQDme3tyQ85SEX9_vGW-K-wLmpys8z09be8-O0A/edit?usp=sharing)  | 아래의 링크에서 확인 가능합니다<br>[최종 발표 PPT](https://docs.google.com/presentation/d/1W4t59tDPg2AbpBWilCT2unrVpatMymyVSCaQbIATrO0/edit?usp=sharing) |

<br>

###  🐱 주요 사용 기술

#### 프론트엔드

<p>
  <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/html-E34F26?style=for-the-badge&logo=html5&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/font awesome-EF2D5E?style=for-the-badge&logo=fontawesome&logoColor=white"/>
</p>

#### 백엔드 

<p>
  <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/nodejs-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/AWS S3-262261?style=for-the-badge&logo=amazons3&logoColor=white"/>
</p>

<br>

### 🐱 팀원 소개

| 이름   | 역할       | 구현 기능                                    |
| ----  | --------  | --------------------------------------------- |
| 위보람 | 프론트엔드  | 메인 페이지, 장바구니 기능, 디자인 담당 |
| 박상준 | 프론트엔드  | 관리자 페이지 (상품 & 주문 & 시스템코드)  |
| 김가은 | 프론트엔드   | 사용자페이지 (상품 & 장바구니 & 주문)  |
| 신재이 | 백엔드   | 제품 API, 주문 API |
| 권재구 | 백엔드   | 유저 API (카카오 로그인 연동 & 이메일 기능), 시스템 코드 API |

<br>

### 🐱  폴더 구조
- 프론트: `src/views` 폴더 
- 백: src/views 이외 폴더 전체
- 실행: **프론트, 백 동시에, express로 실행**
