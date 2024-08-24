'use strict'

console.log('cart.js loaded');

const allowDrop = (ev) => {
    ev.preventDefault();
    ev.currentTarget.classList.add('drag-over'); 
}

const drag = (ev) => {
    ev.dataTransfer.setData("text", ev.currentTarget.dataset.product);
}

const drop = (ev) => {
    ev.preventDefault();
    ev.currentTarget.classList.remove('drag-over'); 
    const data = ev.dataTransfer.getData("text");
    const cartItems = document.getElementById("cart-items");
    
    if (cartItems.innerHTML === "Arrastra los productos a esta sección") {
        cartItems.innerHTML = ""; 
    }
    cartItems.innerHTML += "<p>" + data + "</p>";
}