'use strict'

const displayCheckoutItems = () => {
    const cartItems = JSON.parse(sessionStorage.getItem('cart')) || []
    const checkoutContainer = document.getElementById('checkout-items')
    checkoutContainer.innerHTML = ''

    cartItems.forEach((item, index) => {
        const productElement = document.createElement('div')
        productElement.classList.add('checkout-item')
        
        productElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="checkout-item-img" />
            <p>${item.name} - Q${item.price} x ${item.quantity}</p>
            <button onclick="removeFromCheckout(${index})">-</button>
            <button onclick="addToCheckout(${index})">+</button>
        `
        checkoutContainer.appendChild(productElement)
    })

    const totalElement = document.getElementById('checkout-total')
    totalElement.innerHTML = `Total: Q${getTotal()}`
}

const addToCheckout = (index) => {
    let cartItems = JSON.parse(sessionStorage.getItem('cart')) || []
    cartItems[index].quantity += 1
    sessionStorage.setItem('cart', JSON.stringify(cartItems))
    displayCheckoutItems()
}

const removeFromCheckout = (index) => {
    let cartItems = JSON.parse(sessionStorage.getItem('cart')) || []
    cartItems[index].quantity -= 1

    if (cartItems[index].quantity === 0) {
        cartItems.splice(index, 1)
    }

    sessionStorage.setItem('cart', JSON.stringify(cartItems))
    displayCheckoutItems()
}

const getTotal = () => {
    const cartItems = JSON.parse(sessionStorage.getItem('cart')) || []
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
}

window.onload = displayCheckoutItems