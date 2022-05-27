const addBtn = document.querySelector(".add-button");
const purchaseBtn = document.querySelector(".purchase-button");

addBtn.addEventListener("click", () =>{
    localStorage.setItem('name','a');
});

purchaseBtn.addEventListener("click", () =>{
    window.location.href = "cart.html";
});