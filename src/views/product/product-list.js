const product = document.querySelectorAll(".product");

[].forEach.call(product,(p)=>{
    p.addEventListener("click", ()=>{
        window.location.href = "product-detail.html";
    });
});

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