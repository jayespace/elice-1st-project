$(document).on('ready', function() {
  
  $(".campaign-box-wrap").slick({
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 3,

    responsive: [ // 반응형 웹 구현 옵션
      {  
        breakpoint: 1280, //화면 사이즈 960px
        settings: {
          //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
          infinite: false,
          slidesToShow: 5,
          slidesToScroll: 3
        } 
      },
      {  
        breakpoint: 1024, //화면 사이즈 960px
        settings: {
          //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
          infinite: false,
          slidesToShow: 5,
          slidesToScroll: 5
        } 
      },
      { 
        breakpoint: 768, //화면 사이즈 768px
        settings: {	
          //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
          infinite: false,
          slidesToShow: 3,
          slidesToScroll: 3
        } 
      }
    ]
  });

 

});