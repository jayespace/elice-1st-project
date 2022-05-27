import * as Api from '/api.js';
const product = document.querySelectorAll(".product");


[].forEach.call(product,(p)=>{
    p.addEventListener("click", ()=>{
        window.location.href = "../detail/detail.html";
    });
});

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

async function getProduct()






// product.onclick = ()=>{
//     alert('show');
// }
// product.addEventListener("click", () => {
//     window.location.href = "product-detail.html";
//     alert('show');
// });

// document.querySelector('.product').addEventListener("click", (m = `/product/detail?id=${n}`,
//             function() {
//                 window.location.href = m
//             }
//             ))